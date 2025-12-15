import React from "react";
import { useNavigate } from "react-router-dom";

export default function FinalReview() {
  const navigate = useNavigate();

  // Load saved data
  const data = JSON.parse(localStorage.getItem("analysisData") || "{}");

  const {
    atsScore = 0,
    skillMatchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    recommendations = [],
  } = data;

  /* --------- FINAL SUMMARY --------- */
  const finalSummary = `
Your resume achieved an ATS score of ${atsScore}% with a skill match rating of ${skillMatchScore}/10.
You demonstrate strong alignment in skills such as ${
    matchedSkills.length ? matchedSkills.join(", ") : "core technical fundamentals"
  }.
Key skill gaps identified include ${
    missingSkills.length ? missingSkills.join(", ") : "no major missing requirements"
  }.
To improve your chances of selection, focus on ${
    recommendations.length ? recommendations.slice(0, 3).join(", ") : "strengthening role-specific skills"
  }.
Overall, with targeted upskilling and focused preparation, your profile can become highly competitive.
`;

  return (
    <div style={styles.page}>
      {/* BRAND */}
      <h1 style={styles.brand}>CAREERSYNC AI</h1>
      <p style={styles.subtitle}>Final Resume Evaluation</p>

      {/* SUMMARY CARD */}
      <div style={styles.card}>
        <h3 style={styles.title}>Overall Evaluation</h3>
        <p style={styles.text}>{finalSummary}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.bottomButtons}>
        <button
          style={styles.primaryButton}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow = "0 0 30px rgba(0,255,255,1)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 0 18px rgba(0,255,255,0.6)")
          }
          onClick={() => navigate("/resume-analysis")}
        >
          Upload New Resume
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* ======================
   MATCHED UI STYLES
   ====================== */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #0A1A2F, #004E92)",
    color: "#E6F0F8",
    fontFamily: "Segoe UI, Roboto, Arial",
    position: "relative",
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
    marginBottom: 35,
    color: "#D0D0D0",
  },

  card: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 32,
    background: "#000408",
    borderRadius: 16,
    border: "2px solid rgba(0,255,255,0.4)",
    boxShadow: "0 0 30px rgba(0,255,255,0.35)",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
    color: "#00FFFF",
  },

  text: {
    fontSize: 18,
    lineHeight: 1.7,
    whiteSpace: "pre-line",
    opacity: 0.96,
  },

  /* --- FIXED BOTTOM RIGHT BUTTONS --- */
  bottomButtons: {
    position: "fixed",
    bottom: 30,
    right: 30,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  primaryButton: {
    padding: "14px 26px",
    background: "#00FFFF",
    color: "#000408",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(0,255,255,0.6)",
    transition: "0.3s ease",
  },

  secondaryButton: {
    padding: "14px 26px",
    background: "#000408",
    color: "#00FFFF",
    border: "2px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
};
