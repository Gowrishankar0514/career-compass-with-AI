import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// INIT GROQ AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResume = async (req, res) => {
  try {
    console.log('📌 /analyze request received');

    console.log(req.body);

    const { resumeText, jdText } = req.body;

    console.log(resumeText);
    console.log(jdText);

    if (!resumeText || !jdText) {
      return res.status(400).json({
        success: false,
        msg: 'resumeText and jdText are required',
      });
    }

    const resume = resumeText.toLowerCase();
    const jd = jdText.toLowerCase();

    console.log('📄 Resume text length:', resume.length);
    console.log('📄 JD text length:', jd.length);

    // --------------------------------------------------------
    // SIMPLE ATS SKILL MATCH ENGINE
    // --------------------------------------------------------
    const skillBank = [
      'java',
      'javascript',
      'react',
      'node',
      'express',
      'mongodb',
      'sql',
      'python',
      'html',
      'css',
      'git',
      'github',
      'aws',
      'cloud',
      'machine learning',
      'deep learning',
      'api',
      'rest',
      'data structures',
    ];

    const foundSkills = skillBank.filter((skill) => resume.includes(skill));

    const jdSkills = skillBank.filter((skill) => jd.includes(skill));

    const missingSkills = jdSkills.filter(
      (skill) => !foundSkills.includes(skill)
    );

    let atsScore = 0;

    if (jdSkills.length > 0) {
      atsScore = Math.round(
        ((jdSkills.length - missingSkills.length) / jdSkills.length) * 100
      );
    }

    // --------------------------------------------------------
    // AI ANALYSIS USING GROQ
    // --------------------------------------------------------
    let aiSummary = 'AI summary unavailable';

    try {
      const prompt = `
You are an ATS + Resume Analysis AI.

Here is PRE-CALCULATED ATS DATA from my system.  
You MUST use this data in the final JSON output:

ATS Score: ${atsScore}
Detected Skills: ${JSON.stringify(foundSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

-------------------------
RESUME TEXT:
${resume}

JOB DESCRIPTION:
${jd}
-------------------------

Using ALL information above, return ONLY a valid JSON.

{
  "atsScore": number,
  "detectedSkills": ["string"],
  "missingSkills": ["string"],

  "summary": "string",
  "strongSkills": ["string"],
  "weakAreas": ["string"],
  "skillGapAnalysis": "string",
  "recommendedSkills": ["string"],
  "finalRecommendation": "string",
  "resumeTips": ["string"],

  "professionalRewrite": "string",

  "interviewPrep": {
    "technicalQuestions": ["string"],
    "hrQuestions": ["string"]
  },

  "fullAnalysisReport": "string"
}

RULES:
- ALWAYS use the ATS score I provided (${atsScore}) — do NOT invent a new one.
- "detectedSkills" MUST match the list: ${JSON.stringify(foundSkills)}
- "missingSkills" MUST match this list: ${JSON.stringify(missingSkills)}
- NEVER leave any field empty.
- NEVER change the JSON structure.
- NO markdown, NO comments, ONLY valid JSON.
`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an ATS + Career Analyst AI.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      });

      aiSummary = completion.choices[0]?.message?.content || aiSummary;
    } catch (err) {
      console.log('❌ AI Error:', err.message);
    }

    // --------------------------------------------------------
    // FINAL RESPONSE
    // --------------------------------------------------------
    return res.json({
      success: true,
      atsScore,
      foundSkills,
      missingSkills,

      strongAreas: foundSkills.length
        ? foundSkills.join(', ')
        : 'No strong skills detected',

      weakAreas: missingSkills.length
        ? missingSkills.join(', ')
        : 'No missing skills detected',

      recommendedSkills: missingSkills.length
        ? missingSkills.map((s) => `Learn and practice ${s}`)
        : ['You match all JD skills!'],

      finalRecommendation:
        atsScore >= 80
          ? 'Excellent match! Apply confidently.'
          : atsScore >= 60
          ? 'Good match — Improve missing skills.'
          : 'Low match — Build essential skills before applying.',

      aiSummary, // ⭐ Full AI-generated output
    });
  } catch (err) {
    console.error('🔥 SERVER ERROR:', err);
    return res.status(500).json({
      success: false,
      msg: 'Internal Server Error',
      error: err.message,
    });
  }
};
