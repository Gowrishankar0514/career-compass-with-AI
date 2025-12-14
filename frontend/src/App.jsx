import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Resume from "./pages/Resume";
import FinalReview from "./pages/FinalReview";

export default function App() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Resume Analysis Flow */}
        <Route path="/resume-analysis" element={<Resume />} />
        <Route path="/analysis-result" element={<FinalReview />} />

        {/* Fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  );
}
