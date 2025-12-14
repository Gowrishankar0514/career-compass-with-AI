import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// ----------------------------------------
// INIT GROQ CLIENT
// ----------------------------------------
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// ----------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------
const normalize = (text = "") =>
  String(text)
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// Skill matcher (word-boundary aware)
function skillInText(skill, text) {
  if (!skill || !text) return false;

  const n = normalize(text);
  const s = skill.toLowerCase().trim();

  if (n.includes(s)) return true;

  const safe = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${safe}\\b`, "i");

  return re.test(n);
}

// Extract JSON safely from AI response
function extractJsonObject(raw) {
  if (!raw || typeof raw !== "string") return null;

  let text = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) return null;

  const candidate = text.slice(first, last + 1).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    try {
      return JSON.parse(candidate.replace(/\s+/g, " "));
    } catch {
      return null;
    }
  }
}

// ----------------------------------------
// RESUME ANALYZER CONTROLLER
// ----------------------------------------
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jdText } = req.body ?? {};

    if (!resumeText || !jdText) {
      return res.status(400).json({
        success: false,
        msg: "resumeText and jdText are required",
      });
    }

    // ----------------------------------------
    // SKILL BANK (EDITABLE)
    // ----------------------------------------
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

    // Detect skills
    const jdSkills = skillBank.filter((s) => skillInText(s, jdText));

    // Resume detected skills
    const resumeSkills = skillBank.filter((s) => skillInText(s, resumeText));

    const matchedSkills = jdSkills.filter((s) =>
      resumeSkills.includes(s)
    );

    const missingSkills = jdSkills.filter(
      (s) => !resumeSkills.includes(s)
    );

    // ----------------------------------------
    // ATS SCORE CALCULATION
    // ----------------------------------------
    let atsScore = 0;

    if (jdSkills.length > 0) {
      atsScore = Math.round(
        (matchedSkills.length / jdSkills.length) * 100
      );
    } else {
      atsScore = Math.round(
        (resumeSkills.length / skillBank.length) * 100
      );
    }

    atsScore = Math.max(0, Math.min(100, atsScore));

    // Skill Match Score (0–10)
    const skillMatchScore =
      jdSkills.length > 0
        ? Math.round((matchedSkills.length / jdSkills.length) * 10)
        : Math.round((resumeSkills.length / skillBank.length) * 10);

    // ----------------------------------------
    // AI PROMPT
    // ----------------------------------------
    const aiPrompt = `
You are an expert technical interviewer and resume analyst.

Use ONLY this data exactly as provided:
ATS Score: ${atsScore}
Matched Skills: ${JSON.stringify(matchedSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

Resume:
${resumeText}

Job Description:
${jdText}

Return ONLY valid JSON with EXACT fields:
{
  "technicalQuestions": ["q1","q2","q3","q4","q5"],
  "hrQuestions": ["q1","q2","q3"],
  "recommendations": ["rec1","rec2","rec3"],
  "finalReview": "Exactly 3 sentences."
}
`;

    // ----------------------------------------
    // FALLBACK DATA
    // ----------------------------------------
    const fallback = {
      technicalQuestions: [
        `Explain how you used ${matchedSkills[0] || "a core skill"} in a project.`,
        "Describe a difficult bug you fixed.",
        "How would you design a scalable REST API?",
        "How do you optimize database queries?",
        "Explain a performance improvement you implemented.",
      ],
      hrQuestions: [
        "Why are you interested in this role?",
        "Tell me about a team conflict you resolved.",
        "What motivates you to learn new skills?",
      ],
      recommendations:
        missingSkills.length > 0
          ? missingSkills.map((s) => `Learn and practice ${s}`)
          : [
              "Highlight measurable project results",
              "Add cloud or DevOps exposure",
              "Improve system design knowledge",
            ],
      finalReview: `The resume shows an ATS match of ${atsScore}%, indicating a ${
        atsScore >= 80 ? "strong" : atsScore >= 60 ? "moderate" : "low"
      } fit. Strengths include ${
        matchedSkills.length ? matchedSkills.join(", ") : "core fundamentals"
      }. Missing skills such as ${
        missingSkills.length ? missingSkills.join(", ") : "none significant"
      } should be improved.`,
    };

    // ----------------------------------------
    // AI CALL (OPTIONAL)
    // ----------------------------------------
    let {
      technicalQuestions,
      hrQuestions,
      recommendations,
      finalReview,
    } = fallback;

    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: aiPrompt }],
          temperature: 0.2,
          max_tokens: 600,
        });

        const raw =
          completion?.choices?.[0]?.message?.content || "";

        const parsed = extractJsonObject(raw);

        if (parsed) {
          if (Array.isArray(parsed.technicalQuestions))
            technicalQuestions = parsed.technicalQuestions.slice(0, 5);

          if (Array.isArray(parsed.hrQuestions))
            hrQuestions = parsed.hrQuestions.slice(0, 3);

          if (Array.isArray(parsed.recommendations))
            recommendations = parsed.recommendations.slice(0, 6);

          if (typeof parsed.finalReview === "string")
            finalReview = parsed.finalReview.trim();
        }
      } catch (err) {
        console.log("❌ AI error, using fallback:", err.message);
      }
    }

    // ----------------------------------------
    // RESPONSE
    // ----------------------------------------
    return res.json({
      success: true,
      atsScore,
      skillMatchScore,
      matchedSkills,
      missingSkills,
      technicalQuestions,
      hrQuestions,
      recommendations,
      finalReview,
    });

  } catch (err) {
    console.error("🔥 Resume Controller Error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
