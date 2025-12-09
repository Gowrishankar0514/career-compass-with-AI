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
        jdText: jdText,
      });

      console.log(res.data);

      // Parse ai JSON if it's a string
      let aiData = res.data.aiSummary;
      if (typeof aiData === "string") {
        aiData = JSON.parse(aiData);
      }

      setResult({
        ...res.data,
        ai: aiData,
      });

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

      {/* Results Section */}
      {result && (
        <div style={styles.resultBox}>
          <h2 style={styles.sectionTitle}>AI Resume Analysis Results</h2>

          {/* ATS Score */}
          <div style={styles.scoreBox}>
            <h3 style={styles.scoreLabel}>ATS Score</h3>
            <p style={styles.scoreValue}>{result.atsScore}%</p>
          </div>

          {/* Found Skills */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Skills Detected in Resume</h3>
            <p style={styles.text}>
              {result.foundSkills?.length
                ? result.foundSkills.join(", ")
                : "No matching skills found."}
            </p>
          </div>

          {/* Missing Skills */}
          <div style={styles.subCard}>
            <h3 style={{ ...styles.subTitle, color: "#ff6b6b" }}>
              Missing Skills (Based on JD)
            </h3>
            <p style={styles.text}>
              {result.missingSkills?.length
                ? result.missingSkills.join(", ")
                : "No missing skills 🎉"}
            </p>
          </div>

          {/* ------------------- AI SECTION ------------------- */}

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>AI Summary</h3>
            <p style={styles.text}>{result.ai?.summary}</p>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Strong Skills 💪</h3>
            <ul>
              {result.ai?.strongSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Missing Skills (AI) ⚠</h3>
            <ul>
              {result.ai?.missingSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Weak Areas ⚠</h3>
            <ul>
              {result.ai?.weakAreas?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Skill Gap Analysis 🧠</h3>
            <p style={styles.text}>{result.ai?.skillGapAnalysis}</p>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Recommended Skills 🎯</h3>
            <ul>
              {result.ai?.recommendedSkills?.map((s, i) => (
                <li key={i} style={styles.listItem}>{s}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Final Recommendation 📌</h3>
            <p style={styles.text}>{result.ai?.finalRecommendation}</p>
          </div>

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

          {/* Interview Questions */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Interview Prep – Technical Questions 💻</h3>
            <ul>
              {result.ai?.interviewPrep?.technicalQuestions?.map((q, i) => (
                <li key={i} style={styles.listItem}>{q}</li>
              ))}
            </ul>
          </div>

          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Interview Prep – HR Questions 👔</h3>
            <ul>
              {result.ai?.interviewPrep?.hrQuestions?.map((q, i) => (
                <li key={i} style={styles.listItem}>{q}</li>
              ))}
            </ul>
          </div>

          {/* Full analysis */}
          <div style={styles.subCard}>
            <h3 style={styles.subTitle}>Full Analysis Report 📄</h3>
            <p style={styles.text}>{result.ai?.fullAnalysisReport}</p>
          </div>

        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#121212",
    minHeight: "100vh",
    padding: "40px",
    color: "white",
    fontFamily: "Arial",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  card: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "40px",
  },
  label: { fontSize: "16px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    marginBottom: "20px",
    background: "#2b2b2b",
    color: "white",
    border: "1px solid #444",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    background: "#2b2b2b",
    color: "white",
    border: "1px solid #444",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4caf50",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    marginTop: "20px",
  },
  resultBox: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "10px",
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  scoreBox: {
    background: "#222",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  scoreLabel: { fontSize: "18px", opacity: 0.8 },
  scoreValue: { fontSize: "28px", fontWeight: "bold" },
  subCard: {
    background: "#252525",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  subTitle: { fontSize: "20px", marginBottom: "10px" },
  text: { opacity: 0.8, lineHeight: "1.5" },
  listItem: { marginBottom: "5px", opacity: 0.9 },
};
