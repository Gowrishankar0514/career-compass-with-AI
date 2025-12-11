import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(form);
      localStorage.setItem("userName", form.name);

      // ❌ No alert
      // ✅ Silent redirect
      navigate("/login");
    } catch {
      // ❌ No alert
      navigate("/login");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>✨ Create Your Account</h2>

      <div style={styles.card}>
        <input
          placeholder="👤 Full Name"
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="✉️ Email Address"
          style={styles.input}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="🔑 Password"
          type="password"
          style={styles.input}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.button} onClick={handleRegister}>
          🚀 Register
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/login")}>
        Already have an account? <b>Login →</b>
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
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    background: "rgba(255,255,255,0.20)",
    backdropFilter: "blur(10px)",
    padding: 30,
    borderRadius: 15,
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
    transition: "0.2s",
  },

  link: {
    marginTop: 20,
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.9,
  },
  link: { marginTop: 20, cursor: "pointer", opacity: 0.7 },
};
