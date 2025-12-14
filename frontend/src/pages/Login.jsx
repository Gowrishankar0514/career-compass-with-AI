import React, { useEffect, useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Clear any autofilled values on mount
  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || "");

      setForm({ email: "", password: "" });
      navigate("/resume-analysis");
    } catch {
      alert("Invalid email or password");
      setForm({ ...form, password: "" });
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.brand}>CAREERSYNC AI</h1>
      <p style={styles.subtitle}>Welcome back</p>

      <div style={styles.card}>
        {/* 🔒 Autofill Trap Inputs */}
        <input
          type="text"
          name="username_fake"
          autoComplete="username"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="password_fake"
          autoComplete="new-password"
          style={{ display: "none" }}
        />

        {/* REAL INPUTS */}
        <input
          type="email"
          name="login_email_unique_987"
          placeholder="Email Address"
          value={form.email}
          autoComplete="off"
          style={styles.input}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          name="login_password_unique_654"
          placeholder="Password"
          value={form.password}
          autoComplete="new-password"
          style={styles.input}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/register")}>
        Don’t have an account? <b>Register</b>
      </p>
    </div>
  );
}

/* =====================
   STYLES (NAVY ONLY)
   ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A1A2F, #004E92)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#E6F0F8",
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  brand: {
    fontSize: 40,
    fontWeight: 800,
    color: "#00FFFF",
    marginBottom: 6,
  },

  subtitle: {
    marginBottom: 25,
    color: "#D0D0D0",
  },

  card: {
    background: "#000408",
    padding: 30,
    width: 360,
    borderRadius: 16,
    border: "2px solid #00FFFF",
    boxShadow: "0 0 30px rgba(0,255,255,0.4)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    marginBottom: 16,
    background: "#000408", // 🔵 CONSTANT NAVY
    border: "1px solid rgba(0,255,255,0.4)",
    borderRadius: 12,
    color: "#E6F0F8",
    fontSize: 16,
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
  },

  link: {
    marginTop: 20,
    color: "#00FFFF",
    cursor: "pointer",
  },
};
