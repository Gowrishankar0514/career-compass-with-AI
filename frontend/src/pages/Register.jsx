import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(form);

      // clear data after success
      setForm({ name: "", email: "", password: "" });

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");

      // clear password if error
      setForm({ ...form, password: "" });
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.brand}>CAREERSYNC AI</h1>
      <p style={styles.subtitle}>Create your account</p>

      <div style={styles.card}>
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          autoComplete="off"
          style={styles.input}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          autoComplete="new-email"
          style={styles.input}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          autoComplete="new-password"
          style={styles.input}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/login")}>
        Already have an account? <b>Login</b>
      </p>
    </div>
  );
}

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
    background: "#000408",
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
