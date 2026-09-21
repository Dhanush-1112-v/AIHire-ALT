import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const candidateId = 1;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/api/results/${candidateId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assessment results.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Assessment results were not available.");
        }

        setResults(data.results);
      } catch (err) {
        setError(err.message || "Unable to load results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getScoreClass = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    return "needs-improvement";
  };

  if (loading) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <h2>Loading Assessment Results...</h2>
            <p>Fetching your results from AIHire.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="error-card">
            <h2>Unable to Load Results</h2>
            <p>{error}</p>
            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-container">

        <header className="results-header">
          <div>
            <p className="results-label">AIHire Assessment</p>
            <h1>Candidate Results</h1>
            <p className="results-subtitle">
              Complete AI-powered assessment summary
            </p>
          </div>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </header>

        <section className="overall-card">
          <div className="overall-content">
            <div>
              <span className="section-label">
                Overall Candidate Score
              </span>

              <h2>{results.overall_score}%</h2>

              <p>
                Based on resume, interview, communication and coding
                assessment
              </p>
            </div>

            <div
              className={`score-circle ${getScoreClass(
                results.overall_score
              )}`}
            >
              <span>{results.overall_score}</span>
              <small>/100</small>
            </div>
          </div>
        </section>

        <section className="score-grid">

          <div className="score-card">
            <div className="score-card-top">
              <span className="score-icon">📄</span>
              <span>Resume Match</span>
            </div>

            <strong>{results.resume_score}%</strong>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${results.resume_score}%`
                }}
              />
            </div>

            <p>Resume ↔ Job Description</p>
          </div>

          <div className="score-card">
            <div className="score-card-top">
              <span className="score-icon">🤖</span>
              <span>Technical Interview</span>
            </div>

            <strong>{results.technical_score}%</strong>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${results.technical_score}%`
                }}
              />
            </div>

            <p>Technical answer evaluation</p>
          </div>

          <div className="score-card">
            <div className="score-card-top">
              <span className="score-icon">🎤</span>
              <span>Communication</span>
            </div>

            <strong>{results.communication_score}%</strong>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${results.communication_score}%`
                }}
              />
            </div>

            <p>Speech and communication analysis</p>
          </div>

          <div className="score-card">
            <div className="score-card-top">
              <span className="score-icon">💻</span>
              <span>Coding Assessment</span>
            </div>

            <strong>{results.coding_score}%</strong>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${results.coding_score}%`
                }}
              />
            </div>

            <p>Programming and test-case performance</p>
          </div>

        </section>

        <section className="two-column">

          <div className="result-panel">
            <div className="panel-title">
              <h3>Matched Skills</h3>
              <span className="success-badge">Verified</span>
            </div>

            <div className="skill-list">
              <span className="skill matched">✓ Python</span>
              <span className="skill matched">✓ Java</span>
              <span className="skill matched">✓ SQL</span>
              <span className="skill matched">✓ React</span>
              <span className="skill matched">
                ✓ Machine Learning
              </span>
            </div>
          </div>

          <div className="result-panel">
            <div className="panel-title">
              <h3>Skill Gaps</h3>
              <span className="warning-badge">Improve</span>
            </div>

            <div className="skill-list">
              <span className="skill gap">+ Docker</span>
              <span className="skill gap">+ System Design</span>
              <span className="skill gap">+ AWS</span>
            </div>
          </div>

        </section>

        <section className="integrity-card">
          <div>
            <span className="integrity-icon">🛡️</span>

            <div>
              <h3>AI-Assistance & Proctoring</h3>

              <p>
                Assessment behavior was monitored for suspicious activity.
              </p>
            </div>
          </div>

          <span className="normal-badge">Normal</span>
        </section>

        <section className="summary-card">
          <div className="panel-heading">
            <span>🧠</span>

            <div>
              <h3>AI Assessment Summary</h3>

              <p>
                Generated from the complete candidate assessment
              </p>
            </div>
          </div>

          <p className="summary-text">
            The candidate demonstrated strong technical knowledge and
            good problem-solving ability. The resume shows good alignment
            with the selected role. Communication was clear, while further
            improvement can be made in technical explanation depth.
          </p>
        </section>

        <section className="recommendation-card">
          <div className="panel-heading">
            <span>💡</span>

            <div>
              <h3>Personalized Recommendations</h3>

              <p>
                Suggested areas for improvement
              </p>
            </div>
          </div>

          <div className="recommendation-list">
            <div className="recommendation">
              <span>1</span>
              <p>Practice System Design fundamentals</p>
            </div>

            <div className="recommendation">
              <span>2</span>
              <p>Improve cloud deployment knowledge</p>
            </div>

            <div className="recommendation">
              <span>3</span>
              <p>Strengthen Docker and containerization skills</p>
            </div>

            <div className="recommendation">
              <span>4</span>
              <p>
                Practice explaining technical solutions with more detail
              </p>
            </div>
          </div>
        </section>

        <div className="results-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate("/candidate-report")}
          >
            View Candidate Report →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Results;