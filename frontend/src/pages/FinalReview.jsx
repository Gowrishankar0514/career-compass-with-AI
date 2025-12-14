import React from "react";
import { useNavigate } from "react-router-dom";

export default function FinalReview() {
  const navigate = useNavigate();

  // Load saved data
  const data = JSON.parse(localStorage.getItem("analysisData") || "{}");

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Final Summary</h1>

      {/* FINAL SUMMARY ONLY */}
      <div style={styles.card}>
        <h3 style={styles.title}>Overall Review</h3>
        <p style={styles.text}>
          {data.finalReview || "No final summary available."}
        </p>
      </div>

      {/* FIXED BOTTOM RIGHT BUTTONS */}
      <div style={styles.bottomButtons}>
        <button
          style={styles.primaryButton}
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

/* -------------------- UI STYLES -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #0A1A2F, #004E92)",
    color: "white",
    fontFamily: "Segoe UI, Roboto, Arial",
    position: "relative",
  },

  heading: {
    fontSize: 40,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 40,
  },

  card: {
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
    padding: 30,
    borderRadius: 12,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 12,
  },

  text: {
    fontSize: 18,
    lineHeight: 1.6,
    opacity: 0.95,
  },

  /* --- FIXED BOTTOM RIGHT BUTTONS --- */
  bottomButtons: {
    position: "fixed",
    bottom: 30,
    right: 30,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  primaryButton: {
    padding: "12px 20px",
    background: "#00E0FF",
    color: "#0A1A2F",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(0,255,255,0.5)",
  },

  secondaryButton: {
    padding: "12px 20px",
    background: "#ffffff",
    color: "#0A1A2F",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 12,
    cursor: "pointer",
    color: "#000",
  },
};
