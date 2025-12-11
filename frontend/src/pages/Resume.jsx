import React, { useState } from "react";
import { analyzeResume } from "../api";
import { extractTextFromPDF } from "../utils/pdfReader";
import { useNavigate } from "react-router-dom";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);

      const res = await analyzeResume({
        resumeText: extractedText,
        jdText,
      });

      // Save analysis to Final Review Page
      localStorage.setItem("analysisData", JSON.stringify(res.data));

      // Redirect to Final Review page
      navigate("/analysis-result");
    } catch (err) {
      console.error("Error analyzing resume: ", err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📄 Resume Analyzer</h1>

      {/* Upload + JD Section */}
      <div style={styles.card}>

        {/* Upload Resume */}
        <label style={styles.label}>📁 Upload Resume (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          style={styles.input}
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Job Description */}
        <label style={styles.label}>📝 Paste Job Description</label>
        <textarea
          rows={6}
          style={styles.textarea}
          placeholder="Paste the Job Description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />

        {/* Analyze Button */}
        <button style={styles.button} onClick={handleAnalyze}>
          {loading ? "⏳ Analyzing..." : "🚀 Analyze Resume"}
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

/* -------------------- Updated Bright UI Styles -------------------- */

const styles = {
  page: {
    background: "#0f0f15",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FF00D4, #00E0FF)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    color: "white",
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  heading: {
    fontSize: 38,
    fontWeight: 800,
    marginBottom: 25,
  },

  card: {
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    padding: 30,
    borderRadius: 18,
    width: "450px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    display: "block",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    background: "rgba(255,255,255,0.25)",
    border: "none",
    color: "white",
    borderRadius: 8,
    outline: "none",
    fontSize: 14,
  },

  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    background: "rgba(255,255,255,0.25)",
    border: "none",
    color: "white",
    marginBottom: 20,
    minHeight: "120px",
    fontSize: 14,
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 15,
    background: "#00FFA6",
    color: "black",
    border: "none",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
    transition: "0.2s",
  },
};
