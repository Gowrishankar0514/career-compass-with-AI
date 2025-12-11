import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);

      // ❌ No alert
      // ✅ Silent redirect
      navigate("/resume-analysis");
    } catch {
      // ❌ No alert
      // Optionally stay on page or redirect
      navigate("/login");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🔐 Login to Career Compass</h2>

      <div style={styles.card}>
        <input
          placeholder="✉️ Email"
          style={styles.input}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="🔑 Password"
          type="password"
          style={styles.input}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.button} onClick={login}>
          🚀 Login
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/register")}>
        ➕ Create an account
      </p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FF00D4, #00E0FF)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "white",
  },

  heading: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 700,
  },

  card: {
    background: "rgba(255, 255, 255, 0.18)",
    padding: 30,
    borderRadius: 15,
    backdropFilter: "blur(10px)",
    width: "350px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 15,
    background: "rgba(255,255,255,0.25)",
    border: "none",
    color: "white",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 14,
    background: "#00FFA6",
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 10,
  },

  link: {
    marginTop: 20,
    cursor: "pointer",
    opacity: 0.9,
    fontSize: 16,
  },
  link: { marginTop: 20, cursor: "pointer", opacity: 0.7 },
};
