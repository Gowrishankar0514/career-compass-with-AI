import React, { useState } from "react";
import { analyzeResume } from "../api";
import { extractTextFromPDF } from "../utils/pdfReader";
import { useNavigate } from "react-router-dom";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file || !jdText.trim()) return;

    setLoading(true);
    try {
      const resumeText = await extractTextFromPDF(file);
      const res = await analyzeResume({ resumeText, jdText });
      setResult(res.data);
      localStorage.setItem("analysisData", JSON.stringify(res.data));
    } catch {
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.brand}>CAREERSYNC AI</h1>
      <p style={styles.subtitle}>AI Resume & Job Match Analyzer</p>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <label style={styles.label}>Upload Resume (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          style={styles.input}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label style={styles.label}>Paste Job Description</label>
        <textarea
          style={styles.textarea}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste job description here..."
        />

        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow = "0 0 30px rgba(0,255,255,1)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 0 18px rgba(0,255,255,0.6)")
          }
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.resultBox}>
          <h2 style={styles.sectionMain}>Resume Analysis Result</h2>

          <div style={styles.statRow}>
            <div style={styles.statCard}>
              <span>ATS Score</span>
              <strong>{result.atsScore}%</strong>
            </div>

            <div style={styles.statCard}>
              <span>Skill Match</span>
              <strong>{result.skillMatchScore}/10</strong>
            </div>
          </div>

          <Section title="Matched Skills">
            {result.matchedSkills?.join(", ") || "No matched skills"}
          </Section>

          <Section title="Missing Skills" danger>
            {result.missingSkills?.join(", ") || "No missing skills"}
          </Section>

          <Section title="Recommended Skills to Learn">
            <ul>
              {result.recommendedSkills?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>

          <Section title="Technical Interview Questions">
            <ol>
              {result.technicalQuestions?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </Section>

          <button style={styles.nextButton} onClick={() => navigate("/analysis-result")}>
            Go to Final Review
          </button>
        </div>
      )}
    </div>
  );
}

/* SECTION COMPONENT */
const Section = ({ title, children, danger }) => (
  <div style={styles.section}>
    <h3
      style={{
        ...styles.sectionTitle,
        color: danger ? "#ff6b6b" : "#00FFFF",
      }}
    >
      {title}
    </h3>
    <div style={styles.sectionBody}>{children}</div>
  </div>
);

/* ======================
   COLOR MATCHED STYLES
   ====================== */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A1A2F, #004E92)",
    padding: 40,
    color: "#E6F0F8",
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  brand: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: 800,
    color: "#00FFFF",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#D0D0D0",
  },

  card: {
    maxWidth: 900,
    margin: "0 auto 30px",
    padding: 30,
    background: "#000408",
    border: "2px solid #00FFFF",
    borderRadius: 16,
    boxShadow: "0 0 30px rgba(0,255,255,0.4)",
  },

  label: {
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 16,
    background: "#000408",
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    color: "#E6F0F8",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    padding: "14px 16px",
    background: "#000408",
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    color: "#E6F0F8",
    marginBottom: 20,
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 16,
    background: "#00FFFF",
    color: "#000408",
    fontSize: 18,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(0,255,255,0.6)",
    transition: "0.3s ease",
  },

  resultBox: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 30,
    background: "#000408",
    borderRadius: 16,
    border: "2px solid rgba(0,255,255,0.4)",
  },

  sectionMain: {
    textAlign: "center",
    fontSize: 26,
    marginBottom: 25,
  },

  statRow: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    background: "#000408",
    padding: 20,
    borderRadius: 12,
    border: "1px solid rgba(0,255,255,0.3)",
    textAlign: "center",
  },

  section: { marginBottom: 25 },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },

  sectionBody: {
    opacity: 0.95,
  },

  nextButton: {
    width: "100%",
    padding: 16,
    background: "#00FFFF",
    color: "#000408",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(0,255,255,0.6)",
  },
};
