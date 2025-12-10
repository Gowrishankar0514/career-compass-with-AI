import React, { useState } from "react";
import { analyzeResume } from "../api";
import { extractTextFromPDF } from "../utils/pdfReader";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume!");
      return;
    }

    setLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);

      const res = await analyzeResume({
        resumeText: extractedText,
        jdText,
      });

      console.log(res.data);

      // Parse ai JSON if it's a string
      let aiData = res.data.aiSummary;
      if (typeof aiData === "string") aiData = JSON.parse(aiData);

      setResult({ ...res.data, ai: aiData });

    } catch (err) {
      console.error(err);
      alert("Error analyzing resume ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Resume Analyzer ⚡</h1>

      {/* Upload + JD Section */}
      <div style={styles.card}>
        <label style={styles.label}>Upload Resume (PDF Only)</label>
        <input
          type="file"
          accept="application/pdf"
          style={styles.input}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label style={styles.label}>Paste Job Description</label>
        <textarea
          rows={6}
          style={styles.textarea}
          placeholder="Paste JD here for AI comparison..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />

        <button style={styles.button} onClick={handleAnalyze}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div style={styles.resultBox}>

          <h2 style={styles.sectionTitle}>AI Resume Analysis</h2>

          {/* ATS SCORE */}
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>ATS Score</h3>
            <p style={styles.statValue}>{result.atsScore}%</p>
          </div>

          {/* FOUND SKILLS */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Skills Detected</h3>
            <p style={styles.text}>
              {result.foundSkills?.length
                ? result.foundSkills.join(", ")
                : "No matching skills found."}
            </p>
          </div>

          {/* MISSING SKILLS */}
          <div style={styles.subCard}>
            <h3 style={{ ...styles.subTitle, color: "#ff5f5f" }}>
              Missing Skills
            </h3>
            <p style={styles.text}>
              {result.missingSkills?.length
                ? result.missingSkills.join(", ")
                : "No missing skills 🎉"}
            </p>
          </div>

          {/* AI Summary */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>AI Summary</h3>
            <p style={styles.text}>{result.ai?.summary}</p>
          </div>

          {/* Strong Skills */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Strong Skills 💪</h3>
            <ul>
              {result.ai?.strongSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Missing Skills AI */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Missing Skills (AI) ⚠</h3>
            <ul>
              {result.ai?.missingSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Weak Areas */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Weak Areas ⚠</h3>
            <ul>
              {result.ai?.weakAreas?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Skill Gap Analysis */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Skill Gap Analysis 🧠</h3>
            <p style={styles.text}>{result.ai?.skillGapAnalysis}</p>
          </div>

          {/* Recommended Skills */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Recommended Skills 🎯</h3>
            <ul>
              {result.ai?.recommendedSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Final Recommendation */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Final Recommendation 📌</h3>
            <p style={styles.text}>{result.ai?.finalRecommendation}</p>
          </div>

          {/* Resume Tips */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Resume Improvement Tips ✏️</h3>
            <ul>
              {result.ai?.resumeTips?.map((tip, i) => (
                <li key={i} style={styles.listItem}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Professional Rewrite */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Professional Summary Rewrite ✍️</h3>
            <p style={styles.text}>{result.ai?.professionalRewrite}</p>
          </div>

          {/* Interview Preparation */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Technical Questions 💻</h3>
            <ul>
              {result.ai?.interviewPrep?.technicalQuestions?.map((q, i) => (
                <li key={i} style={styles.listItem}>{q}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>HR Questions 👔</h3>
            <ul>
              {result.ai?.interviewPrep?.hrQuestions?.map((q, i) => (
                <li key={i} style={styles.listItem}>{q}</li>
              ))}
            </ul>
          </div>

          {/* Full report */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Full Analysis Report 📄</h3>
            <p style={styles.text}>{result.ai?.fullAnalysisReport}</p>
          </div>

        </div>
      )}
    </div>
  );
}

/* -------------------- MNC LEVEL CLEAN UI STYLES -------------------- */

const styles = {
  page: {
    background: "#0f0f15",
    minHeight: "100vh",
    padding: "40px",
    color: "white",
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  heading: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "40px",
  },

  label: {
    fontSize: "15px",
    fontWeight: 600,
    opacity: 0.9,
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    background: "#1d1d27",
    border: "1px solid #444",
    color: "white",
    borderRadius: "6px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    background: "#1d1d27",
    border: "1px solid #444",
    color: "white",
    borderRadius: "6px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#4caf50",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  resultBox: {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "30px",
    borderRadius: "12px",
  },

  sectionTitle: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "20px",
  },

  statCard: {
    background: "#191923",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  statLabel: {
    fontSize: "16px",
    opacity: 0.7,
  },

  statValue: {
    fontSize: "30px",
    fontWeight: 700,
  },

  subCard: {
    background: "#1b1b25",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  subTitle: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "10px",
  },

  text: {
    opacity: 0.85,
    lineHeight: "1.6",
  },

  listItem: {
    opacity: 0.9,
    marginBottom: "6px",
  },
};
