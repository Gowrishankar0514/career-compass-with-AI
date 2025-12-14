import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        :root {
          --bg-dark: #050b14;
          --bg-card: rgba(10, 25, 47, 0.95);
          --border-glow: #00ffff;
          --text-main: #ffffff;
          --text-sub: #9fb7d0;
          --cyan: #00ffff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: radial-gradient(circle at top, #0a1f3c, #02060d);
        }

        /* FULL SCREEN */
        .landing {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        /* MAIN CARD */
        .main-card {
          width: 100%;
          max-width: 1100px;
          padding: 50px 40px;
          border-radius: 16px;
          background: var(--bg-card);
          border: 1px solid rgba(0, 255, 255, 0.45);
          box-shadow: 0 0 25px rgba(0, 255, 255, 0.25);
          text-align: center;
        }

        /* HEADER TEXT */
        .top-tag {
          color: var(--cyan);
          font-size: 0.9rem;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }

        h1 {
          font-size: 3.2rem;
          margin: 0;
          color: var(--text-main);
          text-shadow: 0 0 15px rgba(0,255,255,0.4);
        }

        .subtitle {
          margin-top: 10px;
          font-size: 1.15rem;
          color: var(--text-sub);
        }

        /* FEATURES */
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin: 50px 0;
        }

        .feature {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 255, 0.25);
          border-radius: 12px;
          padding: 25px 20px;
          transition: 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 18px rgba(0,255,255,0.4);
        }

        .feature h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: var(--text-main);
        }

        .feature p {
          font-size: 0.9rem;
          color: var(--text-sub);
          line-height: 1.5;
        }

        /* CTA BUTTON */
        .cta-btn {
          margin-top: 20px;
          background: var(--cyan);
          color: #03131f;
          border: none;
          padding: 14px 40px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,255,255,0.7);
          transition: 0.3s ease;
        }

        .cta-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0,255,255,0.9);
        }

        .bottom-text {
          margin-top: 18px;
          font-size: 0.85rem;
          color: rgba(159,183,208,0.7);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          h1 {
            font-size: 2.4rem;
          }

          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="landing">
        <div className="main-card">

          <div className="top-tag">AI ASSISTANCE FOR DREAM JOBS</div>

          <h1>CareerSync AI</h1>
          <p className="subtitle">
            Navigate Your Future. Master Your Career
          </p>

          <div className="features">
            <div className="feature">
              <h3>Intelligent Match Analysis</h3>
              <p>
                Upload resume and job description for AI-powered compatibility scoring.
              </p>
            </div>

            <div className="feature">
              <h3>Skill Gap Identification</h3>
              <p>
                Identify missing skills and receive targeted learning recommendations.
              </p>
            </div>

            <div className="feature">
              <h3>Personalized Guidance</h3>
              <p>
                Get actionable tips, resume feedback, and career roadmap suggestions.
              </p>
            </div>
          </div>

          <button className="cta-btn" onClick={() => navigate("/register")}>
            START YOUR JOURNEY
          </button>

          <div className="bottom-text">
            Unlock your career potential with AI assistance
          </div>

        </div>
      </div>
    </>
  );
}
