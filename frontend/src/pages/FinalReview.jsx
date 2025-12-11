import React from "react";
import { useNavigate } from "react-router-dom";

export default function FinalReview() {
  const navigate = useNavigate();

  // Load saved data
  const data = JSON.parse(localStorage.getItem("analysisData") || "{}");

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📊 Final AI Resume Review</h1>

      {/* ATS SCORE */}
      <div style={styles.scoreCard}>
        <h2 style={styles.scoreLabel}>ATS Score</h2>
        <p style={styles.scoreValue}>{data.atsScore || 0}%</p>
      </div>

      {/* MATCHED SKILLS */}
      <div style={styles.card}>
        <h3 style={styles.title}>✅ Matched Skills</h3>
        <p style={styles.text}>
          {data.matchedSkills?.length
            ? data.matchedSkills.join(", ")
            : "No matched skills found"}
        </p>
      </div>

      {/* MISSING SKILLS */}
      <div style={styles.card}>
        <h3 style={{ ...styles.title, color: "#ff4d4d" }}>⚠️ Missing Skills</h3>
        <p style={styles.text}>
          {data.missingSkills?.length
            ? data.missingSkills.join(", ")
            : "No missing skills 🎉 Perfect Match!"}
        </p>
      </div>

      {/* TECHNICAL QUESTIONS */}
      <div style={styles.card}>
        <h3 style={styles.title}>💻 Technical Questions</h3>
        <ul style={styles.list}>
          {data.interviewQuestions?.technical?.length
            ? data.interviewQuestions.technical.map((q, i) => (
                <li key={i} style={styles.listItem}>
                  {i + 1}. {q}
                </li>
              ))
            : "No technical questions available"}
        </ul>
      </div>

      {/* HR QUESTIONS */}
      <div style={styles.card}>
        <h3 style={styles.title}>👔 HR Questions</h3>
        <ul style={styles.list}>
          {data.interviewQuestions?.hr?.length
            ? data.interviewQuestions.hr.map((q, i) => (
                <li key={i} style={styles.listItem}>
                  {i + 1}. {q}
                </li>
              ))
            : "No HR questions available"}
        </ul>
      </div>

      {/* FINAL REVIEW */}
      <div style={styles.card}>
        <h3 style={styles.title}>📝 Final Review</h3>
        <p style={styles.text}>{data.finalReview || "No final review available"}</p>
      </div>

      {/* ACTION BUTTONS */}
      <button
        style={styles.button}
        onClick={() => {
          localStorage.removeItem("analysisData");
          navigate("/resume-analysis");
        }}
      >
        🔄 Analyze Another Resume
      </button>

      <button
        style={styles.homeButton}
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        🚪 Logout & Back to Login
      </button>
    </div>
  );
}

/* -------------------- BEAUTIFUL UPDATED UI STYLES -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: 40,
    background: "linear-gradient(135deg, #7F00FF, #E100FF)",
    color: "white",
    textAlign: "center",
    fontFamily: "Segoe UI, Roboto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  heading: {
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 30,
  },

  scoreCard: {
    background: "rgba(0,0,0,0.3)",
    padding: 25,
    borderRadius: 18,
    width: "380px",
    marginBottom: 30,
    border: "1px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },

  scoreLabel: { fontSize: 22, opacity: 0.8 },
  scoreValue: { fontSize: 58, fontWeight: 900 },

  card: {
    background: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    width: "600px",
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 12,
  },

  text: {
    fontSize: 17,
    opacity: 0.9,
    lineHeight: "1.6",
  },

  list: {
    listStyle: "none",
    paddingLeft: 0,
    textAlign: "left",
  },

  listItem: {
    padding: "6px 0",
    fontSize: 17,
    opacity: 0.95,
  },

  button: {
    marginTop: 25,
    padding: "14px 22px",
    background: "#00ff9d",
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    cursor: "pointer",
    color: "#000",
  },

  homeButton: {
    marginTop: 12,
    padding: "14px 22px",
    background: "#ffffff",
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    cursor: "pointer",
    color: "#000",
  },
};
