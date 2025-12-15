import React, { useState } from "react";
import { analyzeResume } from "../api";
import { extractTextFromPDF } from "../utils/pdfReader";
import { useNavigate } from "react-router-dom";

/* ===== PIE CHART ===== */
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

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

  /* ===== PIE CHART DATA ===== */
  const skillMatchPercent = result
    ? Math.round((result.skillMatchScore / 10) * 100)
    : 0;

  const pieData = {
    labels: ["Strong Match", "Skill Gap"],
    datasets: [
      {
        data: [skillMatchPercent, 100 - skillMatchPercent],
        backgroundColor: ["#00FFFF", "#1A2B45"],
        borderWidth: 0,
      },
    ],
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
          style={styles.field}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label style={styles.label}>Paste Job Description</label>
        <textarea
          style={styles.fieldTextarea}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste job description here..."
        />

        <button style={styles.button} onClick={handleAnalyze}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div style={styles.resultBox}>
          <h2 style={styles.sectionMain}>Resume Analysis Result</h2>

          {/* ATS SCORE */}
          <div style={styles.statRowFull}>
            <span>ATS Score</span>
            <strong>{result.atsScore}%</strong>
          </div>

          {/* STRONG MATCH + PIE (SAME BORDER) */}
          <div style={styles.strongMatchBox}>
            <div style={styles.statRowInside}>
              <span>Strong Match</span>
              <strong>{result.skillMatchScore}/10</strong>
            </div>

            <div style={styles.pieSection}>
              <h3 style={styles.pieTitle}>
                Strong Match Skill Distribution
              </h3>
              <div style={styles.pieWrapper}>
                <Pie data={pieData} />
              </div>
            </div>
          </div>

          {/* CONTENT SECTIONS */}
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

          <button
            style={styles.nextButton}
            onClick={() => navigate("/analysis-result")}
          >
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
   STYLES
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
  },

  label: {
    width: "90%",
    margin: "0 auto 6px",
    display: "block",
    fontWeight: 600,
  },

  field: {
    width: "90%",
    margin: "0 auto 16px",
    display: "block",
    padding: "14px 16px",
    background: "#000408",
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    color: "#E6F0F8",
  },

  fieldTextarea: {
    width: "90%",
    margin: "0 auto 20px",
    display: "block",
    minHeight: 120,
    padding: "14px 16px",
    background: "#000408",
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    color: "#E6F0F8",
  },

  button: {
    width: "90%",
    margin: "0 auto",
    display: "block",
    padding: 16,
    background: "#00FFFF",
    color: "#000408",
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
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

  statRowFull: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 22px",
    marginBottom: 20,
    borderRadius: 12,
    border: "1px solid rgba(0,255,255,0.3)",
    fontSize: 18,
    fontWeight: 600,
  },

  strongMatchBox: {
    marginBottom: 30,
    padding: 22,
    borderRadius: 14,
    border: "1px solid rgba(0,255,255,0.3)",
  },

  statRowInside: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 600,
  },

  pieSection: {
    textAlign: "center",
  },

  pieTitle: {
    marginBottom: 12,
    fontSize: 18,
    color: "#00FFFF",
    fontWeight: 600,
  },

  pieWrapper: {
    maxWidth: 220,
    margin: "0 auto",
  },

  section: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 12,
    border: "1px solid rgba(0,255,255,0.3)",
  },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 600,
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
  },
};
