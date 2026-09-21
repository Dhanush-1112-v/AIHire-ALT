import React from "react";
import { useNavigate } from "react-router-dom";

function CandidateReport() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
        color: "#172033"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "35px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}
        >
          <div>
            <p
              style={{
                color: "#ff6600",
                fontWeight: "700",
                marginBottom: "8px"
              }}
            >
              AIHire
            </p>

            <h1 style={{ margin: 0 }}>
              Candidate Assessment Report
            </h1>

            <p style={{ color: "#687386" }}>
              AI-powered interview and assessment summary
            </p>
          </div>

          <button
            onClick={() => navigate("/results")}
            style={{
              padding: "12px 18px",
              borderRadius: "9px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Back to Results
          </button>
        </div>

        <div
          style={{
            background: "#172033",
            color: "#fff",
            borderRadius: "15px",
            padding: "28px",
            marginBottom: "25px"
          }}
        >
          <p style={{ margin: "0 0 8px", color: "#b9c2d1" }}>
            Overall Assessment Score
          </p>

          <div style={{ fontSize: "52px", fontWeight: "800" }}>
            82%
          </div>

          <p style={{ color: "#c3cad6", marginBottom: 0 }}>
            Assessment completed successfully
          </p>
        </div>

        <h2>Assessment Breakdown</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "30px"
          }}
        >
          {[
            ["Resume Match", "86%"],
            ["Technical Interview", "80%"],
            ["Communication", "78%"],
            ["Coding Assessment", "85%"]
          ].map(([title, score]) => (
            <div
              key={title}
              style={{
                border: "1px solid #e5e9f0",
                borderRadius: "12px",
                padding: "20px"
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  color: "#687386",
                  fontWeight: "600"
                }}
              >
                {title}
              </p>

              <strong style={{ fontSize: "28px" }}>
                {score}
              </strong>
            </div>
          ))}
        </div>

        <h2>Matched Skills</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "30px"
          }}
        >
          {["Python", "Java", "SQL", "React", "Machine Learning"].map(
            (skill) => (
              <span
                key={skill}
                style={{
                  padding: "9px 14px",
                  background: "#eef9f2",
                  color: "#16834b",
                  borderRadius: "8px",
                  fontWeight: "600"
                }}
              >
                ✓ {skill}
              </span>
            )
          )}
        </div>

        <h2>Skill Gaps</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "30px"
          }}
        >
          {["Docker", "System Design", "AWS"].map((skill) => (
            <span
              key={skill}
              style={{
                padding: "9px 14px",
                background: "#fff4df",
                color: "#a86400",
                borderRadius: "8px",
                fontWeight: "600"
              }}
            >
              + {skill}
            </span>
          ))}
        </div>

        <h2>AI Assessment Summary</h2>

        <p
          style={{
            color: "#505b6e",
            lineHeight: "1.7",
            marginBottom: "30px"
          }}
        >
          The candidate demonstrated strong technical knowledge and
          good problem-solving ability. The resume shows good alignment
          with the selected role. Communication was clear, while further
          improvement can be made in technical explanation depth.
        </p>

        <h2>Personalized Recommendations</h2>

        <div style={{ display: "grid", gap: "10px" }}>
          {[
            "Practice System Design fundamentals",
            "Improve cloud deployment knowledge",
            "Strengthen Docker and containerization skills",
            "Practice explaining technical solutions in greater detail"
          ].map((recommendation, index) => (
            <div
              key={recommendation}
              style={{
                padding: "14px",
                background: "#f7f8fb",
                borderRadius: "9px"
              }}
            >
              <strong>{index + 1}.</strong> {recommendation}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px"
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "13px 20px",
              borderRadius: "9px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => window.print()}
            style={{
              padding: "13px 20px",
              borderRadius: "9px",
              border: "none",
              background: "#ff6600",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateReport;