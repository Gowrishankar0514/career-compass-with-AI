import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/* ===============================
   INIT GROQ CLIENT
================================ */
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/* ===============================
   UTILS
================================ */
const normalize = (text = "") =>
  String(text)
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\w\s.+]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

const skillAliases = {
  "javascript": ["javascript", "js"],
  "react": ["react", "reactjs"],
  "node": ["node", "nodejs"],
  "express": ["express"],
  "mongodb": ["mongodb", "mongo"],
  "sql": ["sql", "mysql", "postgres"],
  "api": ["api", "rest", "restful"],
  "data structures": ["data structures", "dsa"],
  "aws": ["aws", "cloud"],
  "git": ["git", "github"],
  "java": ["java"],
  "python": ["python"],
};

function hasSkill(skill, text) {
  return skillAliases[skill].some((s) =>
    new RegExp(`\\b${s}\\b`, "i").test(normalize(text))
  );
}

function extractJson(raw) {
  if (!raw) return null;
  const clean = raw.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

/* ===============================
   CONTROLLER
================================ */
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jdText } = req.body;

    if (!resumeText || !jdText) {
      return res.status(400).json({
        success: false,
        message: "resumeText and jdText are required",
      });
    }

    /* ---------- SKILL BANK ---------- */
    const skillBank = Object.keys(skillAliases);

    const jdSkills = skillBank.filter((s) => hasSkill(s, jdText));
    const resumeSkills = skillBank.filter((s) => hasSkill(s, resumeText));

    const matchedSkills = jdSkills.filter((s) =>
      resumeSkills.includes(s)
    );
    const missingSkills = jdSkills.filter(
      (s) => !resumeSkills.includes(s)
    );

    /* ---------- ACCURATE SCORING ---------- */
    const atsScore = jdSkills.length
      ? Math.min(
          95,
          Math.round((matchedSkills.length / jdSkills.length) * 100)
        )
      : 30;

    const skillMatchScore = Math.min(
      10,
      Math.round((matchedSkills.length / (jdSkills.length || 1)) * 10)
    );

    /* ---------- DEFAULT FALLBACK ---------- */
    let technicalQuestions = [
      "Explain how your skills align with the job description.",
      "Describe a challenge related to this role and how you would solve it.",
      "Which missing skill are you currently learning?",
      "How would you design a solution for a real-world problem in this role?",
      "How do you keep your technical skills up to date?",
    ];

    let recommendedSkills = missingSkills.length
      ? missingSkills.map(
          (s) => `Strengthen ${s} through projects and interview practice`
        )
      : [
          "System design fundamentals",
          "Advanced problem solving",
          "Performance optimization",
        ];

    let finalReview = [
      `ATS compatibility is ${atsScore}%.`,
      `Skill match score is ${skillMatchScore}/10.`,
      `Strong skills include ${matchedSkills.join(", ") || "core fundamentals"}.`,
      `Missing skills include ${missingSkills.join(", ") || "none critical"}.`,
      `Focused learning can significantly improve interview success.`,
    ];

    /* ---------- AI ENHANCEMENT ---------- */
    if (groq) {
      try {
        const prompt = `
You are a senior technical interviewer and resume analyst.

Job Description:
${jdText}

Matched Skills:
${matchedSkills.join(", ") || "None"}

Missing Skills:
${missingSkills.join(", ") || "None"}

TASKS:
1. Generate 5 technical interview questions STRICTLY based on the job description.
2. Recommend 5 concrete skills or technologies the candidate must learn to crack the interview.
3. Provide a 5-line professional final review.

Return ONLY valid JSON in this format:

{
  "technicalQuestions": ["q1","q2","q3","q4","q5"],
  "recommendedSkills": ["skill1","skill2","skill3","skill4","skill5"],
  "finalReview": ["line1","line2","line3","line4","line5"]
}

Rules:
- Be specific and practical
- No generic filler
- No markdown
- JSON only
`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.15,
        });

        const parsed = extractJson(
          completion?.choices?.[0]?.message?.content
        );

        if (parsed) {
          technicalQuestions = parsed.technicalQuestions ?? technicalQuestions;
          recommendedSkills = parsed.recommendedSkills ?? recommendedSkills;
          finalReview = parsed.finalReview ?? finalReview;
        }
      } catch {
        console.log("AI fallback used");
      }
    }

    /* ---------- RESPONSE ---------- */
    return res.json({
      success: true,
      atsScore,
      skillMatchScore,
      matchedSkills,
      missingSkills,
      recommendedSkills,
      technicalQuestions,
      finalReview,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
