import React, { useState } from "react";

export default function JobMatch() {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);

  const exampleJobs = [
    { title: "Frontend Developer", match: 92, company: "Google" },
    { title: "Backend Developer", match: 88, company: "Amazon" },
    { title: "Full Stack Engineer", match: 85, company: "Infosys" },
    { title: "React Developer", match: 81, company: "Zoho" },
  ];

  const findJobs = () => {
    // Simulated job matching
    setJobs(exampleJobs);
  };

  return (
    <div style={{ padding: 30, maxWidth: 500, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>AI Job Matcher 🔍</h2>

      <textarea
        placeholder="Enter your skills (ex: React, JavaScript, Node)"
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
        onClick={findJobs}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
        }}
      >
        Find Matching Jobs
      </button>

      <div style={{ marginTop: 30 }}>
        {jobs.map((job, index) => (
          <div
            key={index}
            style={{
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
              background: "#f5f5f5",
              border: "1px solid #ccc",
            }}
          >
            <h3>{job.title}</h3>
            <p>Company: {job.company}</p>
            <p>Match Score: <b>{job.match}%</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}
