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
      alert("Login Successful ✔");
      navigate("/dashboard");
    } catch {
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Login</h2>

      <div style={styles.card}>
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

        <button style={styles.button} onClick={login}>
          Login
        </button>
      </div>

      <p style={styles.link} onClick={() => navigate("/register")}>
        Create an account →
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
