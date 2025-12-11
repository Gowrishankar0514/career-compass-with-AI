import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Init Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Utility to normalize text
const normalize = (text = "") =>
  text
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// More accurate skill matcher
function skillInText(skill, text) {
  if (!skill || !text) return false;

  const normalized = normalize(text);
  const s = skill.toLowerCase().trim();

  if (normalized.includes(s)) return true;

  const re = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return re.test(normalized);
}

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
        msg: "resumeText and jdText are required",
      });
    }

    const resume = resumeText.toLowerCase();
    const jd = jdText.toLowerCase();

    // --------------------------
    // SKILL MATCH ENGINE
    // --------------------------
    const skillBank = [
      "java","javascript","react","node","express","mongodb","sql",
      "python","html","css","git","github","aws","cloud",
      "machine learning","deep learning","api","rest","data structures"
    ];

    // JD SKILLS
    const jdSkills = skillBank.filter((s) => skillInText(s, jdText));

    // Resume detected skills
    const resumeSkills = skillBank.filter((s) => skillInText(s, resumeText));

    // Matched & Missing
    const matchedSkills = jdSkills.filter((s) => resumeSkills.includes(s));
    const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));

    // ATS SCORE
    let atsScore = 0;

    if (jdSkills.length > 0) {
      atsScore = Math.round((matchedSkills.length / jdSkills.length) * 100);
    } else {
      atsScore = Math.round((resumeSkills.length / skillBank.length) * 100);
    }

    if (atsScore < 0) atsScore = 0;
    if (atsScore > 100) atsScore = 100;

    // -----------------------------
    // AI SECTION
    // -----------------------------
    let aiOutput = {
      interviewQuestions: { technical: [], hr: [] },
      finalReview: "",
    };

    try {
      const prompt = `
You are an expert technical interviewer and resume analyst.

Use ONLY this data exactly as provided:
ATS Score: ${atsScore}
Matched Skills: ${JSON.stringify(matchedSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

Resume Text:
${resumeText}

Job Description:
${jdText}

Return ONLY a valid JSON object with EXACTLY this structure:

{
  "interviewQuestions": {
    "technical": ["q1", "q2", "q3", "q4", "q5"],
    "hr": ["q1", "q2", "q3"]
  },
  "finalReview": "3 sentences exactly"
}

RULES:
- 5 technical questions EXACTLY.
- 3 HR questions EXACTLY.
- finalReview MUST be EXACTLY 3 sentences:
   Sentence 1: Overall match (use ATS Score).
   Sentence 2: Strengths and matched skills.
   Sentence 3: Missing skills + improvement advice.
- NO markdown. NO extra text. NO comments. JSON ONLY.
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      let raw = completion?.choices?.[0]?.message?.content || "";

      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const safe = raw.replace(/\n+/g, " ").trim();

      const parsed = JSON.parse(safe);

      aiOutput.interviewQuestions = parsed.interviewQuestions;
      aiOutput.finalReview = parsed.finalReview;

    } catch (err) {
      console.log("❌ AI JSON Error:", err.message);

      aiOutput.interviewQuestions = {
        technical: [
          `Explain ${matchedSkills[0] || "a relevant technology"} in a project.`,
          "How would you optimize a backend API for high throughput?",
          "Explain a debugging challenge you solved.",
          "Describe how you design scalable systems.",
          "Explain a performance optimization you implemented."
        ],
        hr: [
          "Why are you interested in this role?",
          "Describe a conflict you resolved in a team.",
          "What motivates you the most in a work environment?"
        ]
      };

      aiOutput.finalReview =
        `Your resume has an ATS match score of ${atsScore}%, showing partial alignment with the job description. ` +
        `You demonstrate strengths in skills such as ${matchedSkills.join(", ") || "core fundamentals"}. ` +
        `However, missing skills like ${missingSkills.join(", ") || "some important requirements"} may reduce your fit, so improving those areas will strengthen your profile.`;
    }

    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------
    return res.json({
      success: true,
      atsScore,
      matchedSkills,
      missingSkills,
      interviewQuestions: aiOutput.interviewQuestions,
      finalReview: aiOutput.finalReview,
    });

  } catch (err) {
    console.error("🔥 Controller Error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
