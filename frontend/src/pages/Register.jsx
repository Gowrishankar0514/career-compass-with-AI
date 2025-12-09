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
      alert("Registration Successful ✔");
      navigate("/login");
    } catch {
      alert("Registration Failed ❌");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Create an Account</h2>

      <div style={styles.card}>
        <input
          placeholder="Full Name"
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          style={styles.input}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/login")}>
        Already have an account? Login →
      </p>
    </div>
  );
}

const styles = {
  page: { padding: 40, textAlign: "center", color: "white" },
  heading: { fontSize: 28, marginBottom: 20 },
  card: {
    background: "#1e1e1e",
    padding: 30,
    borderRadius: 10,
    width: "350px",
    margin: "auto",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    background: "#2b2b2b",
    color: "white",
    border: "1px solid #444",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4caf50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 5,
  },
  link: { marginTop: 20, cursor: "pointer", opacity: 0.7 },
};
