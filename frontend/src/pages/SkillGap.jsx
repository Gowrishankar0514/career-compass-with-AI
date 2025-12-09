import React, { useState } from "react";

export default function SkillGap() {
  const [skills, setSkills] = useState("");
  const [gaps, setGaps] = useState([]);

  const requiredSkills = ["React", "Node", "MongoDB", "APIs", "Git", "Express"];

  const analyze = () => {
    const userSkills = skills.split(",").map((s) => s.trim());
    const missing = requiredSkills.filter((s) => !userSkills.includes(s));

    setGaps(missing);
  };

  return (
    <div style={{ padding: 30, maxWidth: 500, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Skill Gap Analyzer 📚</h2>

      <textarea
        placeholder="Enter your skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        style={{
          width: "100%",
          height: 100,
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid gray",
        }}
      ></textarea>

      <button
        onClick={analyze}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: "purple",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
        }}
      >
        Analyze Gaps
      </button>

      <div style={{ marginTop: 30 }}>
        {gaps.length === 0 ? (
          <p>No missing skills 🎉</p>
        ) : (
          gaps.map((g, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                background: "#ffe6e6",
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              ❌ Missing Skill: <b>{g}</b>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
