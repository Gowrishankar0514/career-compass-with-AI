import { useState } from "react";
import { analyzeResume } from "../api";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState(""); // Job Description
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a PDF resume!");
      return;
    }

    if (jdText.trim().length === 0) {
      alert("Please paste the Job Description!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jdText", jdText);

    try {
      const res = await analyzeResume(formData);
      setResult(res.data);
      alert("Resume & JD analyzed successfully ✔");
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume ❌");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Resume + Job Description Analyzer</h2>

      {/* Resume Upload */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      {/* Job Description Input */}
      <textarea
        placeholder="Paste Job Description here..."
        rows={10}
        style={{ width: "100%", padding: 10 }}
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />

      <br />
      <br />

      <br /><br />
      <button onClick={handleUpload}>Analyze Resume + JD</button>

      {/* RESULTS */}
      {result && (
        <div style={{ marginTop: 30 }}>
          
          <h3>Resume Preview</h3>
          <p>{result.preview}</p>

          <h3>ATS Score: {result.score}%</h3>

          <h4>Skills Found in Resume:</h4>
          <ul>
            {result.foundSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4>Skills Required from JD:</h4>
          <ul>
            {result.jdSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4>Missing Skills (Improve These):</h4>
          <ul>
            {result.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>Job Match Score: {result.matchScore}%</h3>

          <h3>Final Recommendation:</h3>
          <p>{result.recommendation}</p>
        </div>
      )}
    </div>
  );
}
