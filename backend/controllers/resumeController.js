import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// INIT GROQ AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResume = async (req, res) => {
  try {
    console.log("📌 /analyze request received");

    console.log(req.body);

    const { resumeText, jdText } = req.body;

    console.log(resumeText);
    console.log(jdText);

    if (!resumeText || !jdText) {
      return res.status(400).json({
        success: false,
        msg: "resumeText and jdText are required",
      });
    }

    const resume = resumeText.toLowerCase();
    const jd = jdText.toLowerCase();

    console.log("📄 Resume text length:", resume.length);
    console.log("📄 JD text length:", jd.length);

    // --------------------------------------------------------
    // SIMPLE ATS SKILL MATCH ENGINE
    // --------------------------------------------------------
    const skillBank = [
      "java",
      "javascript",
      "react",
      "node",
      "express",
      "mongodb",
      "sql",
      "python",
      "html",
      "css",
      "git",
      "github",
      "aws",
      "cloud",
      "machine learning",
      "deep learning",
      "api",
      "rest",
      "data structures",
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
    let aiSummary = "AI summary unavailable";

    try {
const prompt = `
You are an ATS + Resume Analysis AI.

Analyze the following resume and job description and return ONLY a valid JSON object. 
No markdown. No text outside JSON. No comments. No explanations.

-------------------------
RESUME:
${resume}

JOB DESCRIPTION:
${jd}
-------------------------

Return JSON with EXACTLY the following fields. 
Every field MUST exist and MUST be filled with meaningful content. NEVER leave empty.

{
  "summary": "string", 
  "strongSkills": ["string"],
  "missingSkills": ["string"],
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

DETAILED REQUIREMENTS:
- summary → 4–6 lines summarizing resume vs JD match.
- strongSkills → list 5–10 strong skills based on resume.
- missingSkills → list all missing JD skills (never empty, add suggestions if needed).
- weakAreas → 5–10 weak areas based on resume.
- skillGapAnalysis → detailed explanation (1–2 paragraphs).
- recommendedSkills → 5–10 skills to learn.
- finalRecommendation → 3–5 sentences.
- resumeTips → at least 5 resume improvement tips.
- professionalRewrite → rewrite professional summary in 4–5 lines.
- interviewPrep.technicalQuestions → ALWAYS 5 questions.
- interviewPrep.hrQuestions → ALWAYS 3 questions.
- fullAnalysisReport → long, full, detailed ATS-style analysis (2–4 paragraphs).

Always return complete JSON, with ALL fields filled.
`;


      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an ATS + Career Analyst AI." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      });

      aiSummary = completion.choices[0]?.message?.content || aiSummary;
    } catch (err) {
      console.log("❌ AI Error:", err.message);
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
        ? foundSkills.join(", ")
        : "No strong skills detected",

      weakAreas: missingSkills.length
        ? missingSkills.join(", ")
        : "No missing skills detected",

      recommendedSkills: missingSkills.length
        ? missingSkills.map((s) => `Learn and practice ${s}`)
        : ["You match all JD skills!"],

      finalRecommendation:
        atsScore >= 80
          ? "Excellent match! Apply confidently."
          : atsScore >= 60
          ? "Good match — Improve missing skills."
          : "Low match — Build essential skills before applying.",

      aiSummary, // ⭐ Full AI-generated output
    });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
