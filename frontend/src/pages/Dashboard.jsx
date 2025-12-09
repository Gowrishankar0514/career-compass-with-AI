import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("userName") || "User";
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    setName(user);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Welcome, {name} 👋</h1>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate("/analyze")}>
          <h3 style={styles.title}>Resume Analyzer</h3>
          <p style={styles.desc}>AI-powered ATS & career insights.</p>
        </div>
      </div>

      <button style={styles.logout} onClick={logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  page: { padding: 40, textAlign: "center", color: "white" },
  heading: { fontSize: 32, marginBottom: 30 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#1e1e1e",
    padding: 25,
    borderRadius: 10,
    cursor: "pointer",
    transition: "0.2s",
  },
  title: { fontSize: 20, marginBottom: 10 },
  desc: { opacity: 0.7 },
  logout: {
    marginTop: 40,
    padding: "12px 25px",
    background: "red",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 5,
  },
};
