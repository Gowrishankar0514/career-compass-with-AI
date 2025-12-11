import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Resume from "./pages/Resume.jsx";
import FinalReview from "./pages/FinalReview.jsx";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #FF00D4, #00E0FF)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <Routes>

          {/* FIRST PAGE → REGISTER */}
          <Route path="/" element={<Navigate to="/register" />} />

          {/* AUTH PAGES */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* MAIN PAGES */}
          <Route path="/resume-analysis" element={<Resume />} />
          <Route path="/analysis-result" element={<FinalReview />} />

          {/* UNKNOWN → REGISTER */}
          <Route path="*" element={<Navigate to="/register" />} />

        </Routes>
      </div>
    </div>
  );
}
