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

    // --------------------------
    // SKILL MATCH ENGINE
    // --------------------------
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

    // --------------------------
    // UPDATED ATS ALGORITHM
    // --------------------------
    const matchedSkills = jdSkills.filter((skill) =>
      foundSkills.includes(skill)
    );

    let atsScore = 0;

    if (jdSkills.length > 0) {
      atsScore = Math.round((matchedSkills.length / jdSkills.length) * 100);
    } else {
      // If JD has no known skills, compute score based on resume richness
      atsScore = Math.round((foundSkills.length / skillBank.length) * 100);
    }

    console.log('jdSkills:', jdSkills);
    console.log('matchedSkills:', matchedSkills);
    console.log('missingSkills:', missingSkills);
    console.log('atsScore:', atsScore);

    // --------------------------
    // AI RESPONSE (NO SKILLS, NO ATS)
    // --------------------------
    let aiResult = {
      summary: 'AI Summary unavailable',
      improvements: [],
      recommendedSkills: [],
    };

    try {
      const prompt = `You are an ATS Resume Analysis Engine.

Generate the following fields only:

{
  "atsScore": number,
  "foundSkills": [string],
  "missingSkills": [string],
  "summary": string,
  "improvements": [string],
  "recommendedSkills": [string]
}

Use these system values directly:
ATS Score: ${atsScore}
Found Skills: ${JSON.stringify(foundSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

Do NOT modify ATS, foundSkills, or missingSkills in the output.
Only generate summary, improvements, and recommendedSkills.

Output valid JSON only.
`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You return ONLY clean JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      });

      let aiText = completion.choices[0]?.message?.content?.trim() || '';

      aiText = aiText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      aiResult = JSON.parse(aiText);
    } catch (err) {
      console.log('❌ AI/JSON Error:', err.message);
    }

    // --------------------------
    // FINAL RESPONSE
    // --------------------------
    return res.json({
      success: true,
      atsScore,
      foundSkills,
      missingSkills,
      summary: aiResult.summary,
      improvements: aiResult.improvements,
      recommendedSkills: aiResult.recommendedSkills,
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
