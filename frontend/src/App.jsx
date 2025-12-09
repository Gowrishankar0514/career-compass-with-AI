import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Resume from "./pages/Resume.jsx";

export default function App() {
  return (
    <div style={{ background: "#121212", minHeight: "100vh", color: "white" }}>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <h2 style={{ textAlign: "center", marginTop: 80 }}>
              Career Compass Frontend Running 🎉
            </h2>
          }
        />

        {/* AUTH PAGES */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* RESUME ANALYZER */}
        <Route path="/analyze" element={<Resume />} />

      </Routes>
    </div>
  );
}
