import React, { useState } from "react";
import { analyzeResume } from "../api";
import { extractTextFromPDF } from "../utils/pdfReader";
import { useNavigate } from "react-router-dom";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file || !jdText.trim()) return;

    setLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);
      const res = await analyzeResume({
        resumeText: extractedText,
        jdText,
      });

      localStorage.setItem("analysisData", JSON.stringify(res.data));
      navigate("/analysis-result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* ===== BRAND HEADING ===== */}
      <h1
        style={styles.brand}
        onMouseEnter={(e) =>
          (e.target.style.textShadow = "0 0 30px #00FFFF")
        }
        onMouseLeave={(e) =>
          (e.target.style.textShadow = "none")
        }
      >
        CAREERSYNC AI
      </h1>

      <p style={styles.subtitle}>
        AI-Powered Resume & Job Match Analysis
      </p>

      {/* ===== MAIN CARD ===== */}
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
          placeholder="Paste the Job Description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />

        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow =
              "0 0 35px rgba(0,255,255,1)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow =
              "0 0 22px rgba(0,255,255,0.6)")
          }
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
    </div>
  );
}

/* =========================
   FINAL COLOR THEME
   ========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A1A2F, #004E92)", // ✅ BLUE BACKGROUND
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    color: "#E6F0F8",
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  brand: {
    fontSize: 42,
    fontWeight: 800,
    letterSpacing: "1.5px",
    marginBottom: 6,
    color: "#00FFFF", // ✅ CYAN TEXT
    transition: "0.3s ease",
  },

  subtitle: {
    fontSize: 15,
    marginBottom: 30,
    color: "#D0D0D0",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "#000408", // ✅ NAVY BOX
    padding: 32,
    borderRadius: 18,
    border: "2px solid #00FFFF",
    boxShadow: "0 0 35px rgba(0,255,255,0.45)",
  },

  label: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 8,
    display: "block",
    color: "#E6F0F8",
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 20,
    background: "#000408", // ✅ NAVY INPUT
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 8,
    color: "#E6F0F8",
    outline: "none",
    fontSize: 14,
  },

  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: 14,
    marginBottom: 22,
    background: "#000408", // ✅ NAVY TEXTAREA
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 8,
    color: "#E6F0F8",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
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
    transition: "0.3s ease",
    boxShadow: "0 0 22px rgba(0,255,255,0.6)",
  },
};
