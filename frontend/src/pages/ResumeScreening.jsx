import API_BASE_URL from "../api";
import { useState } from "react";
import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Brain,
  Target,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import "./ResumeScreening.css";

function ResumeScreening() {
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setResume(file);
      setResult(null);
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!resume || !jobRole) return;

    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("job_role", jobRole);

      const response = await fetch(
        `${API_BASE_URL}/api/resume/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Resume analysis failed."
        );
      }

      setResult(data);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Unable to connect to the AIHire backend."
      );

    } finally {
      setAnalyzing(false);
    }
  };

  const getSkillScore = (skill) => {
    if (!result) return 0;

    if (result.matched_skills.includes(skill)) {
      return Math.min(
        95,
        Math.round(
          70 +
          (result.match_score / 100) * 25
        )
      );
    }

    return 25;
  };

  return (
    <div className="resume-page">

      {/* HEADER */}

      <div className="resume-header">

        <div>

          <div className="breadcrumb">
            AIHire / <span>Resume Intelligence</span>
          </div>

          <h1>Resume Intelligence</h1>

          <p>
            AI-powered candidate analysis using the AIHire-AMCI model.
          </p>

        </div>

        <div className="model-badge">
          <Brain size={18} />
          AIHire-AMCI
        </div>

      </div>


      {/* ANALYSIS CARD */}

      <div className="analysis-card">

        <div className="section-title">

          <div>

            <h2>Candidate Analysis</h2>

            <p>
              Upload a resume and select the target role to begin
              intelligent candidate analysis.
            </p>

          </div>

          <Sparkles size={22} />

        </div>


        <div className="input-grid">

          {/* RESUME */}

          <div className="upload-box">

            <div className="box-icon">
              <FileText size={24} />
            </div>

            <h3>Candidate Resume</h3>

            <p>
              Upload PDF resume
            </p>

            <label className="upload-button">

              <Upload size={17} />

              {resume
                ? "Change Resume"
                : "Upload Resume"}

              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
              />

            </label>

            {resume && (

              <div className="file-selected">

                <CheckCircle2 size={16} />

                {resume.name}

              </div>

            )}

          </div>


          {/* JOB ROLE */}

          <div className="role-box">

            <div className="box-icon">
              <Briefcase size={24} />
            </div>

            <h3>Target Job Role</h3>

            <p>
              Select the position being evaluated
            </p>

            <select
              value={jobRole}
              onChange={(e) => {
                setJobRole(e.target.value);
                setResult(null);
                setError("");
              }}
            >

              <option value="">
                Select job role
              </option>

              <option value="Software Developer">
                Software Developer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Machine Learning Engineer">
                Machine Learning Engineer
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

            </select>

          </div>

        </div>


        {/* ANALYZE BUTTON */}

        <button
          className="analyze-button"
          disabled={!resume || !jobRole || analyzing}
          onClick={handleAnalyze}
        >

          {analyzing ? (
            <>
              <Loader2
                size={18}
                className="spin"
              />

              AIHire-AMCI is analyzing...
            </>
          ) : (
            <>
              <Sparkles size={18} />

              Analyze Candidate

              <ArrowRight size={18} />
            </>
          )}

        </button>


        {/* ERROR */}

        {error && (

          <div className="error-message">
            <AlertTriangle size={17} />
            {error}
          </div>

        )}

      </div>


      {/* REAL RESULTS */}

      {result && (

        <div className="results-section">

          {/* MATCH SCORE */}

          <div className="score-card">

            <div className="score-left">

              <div className="result-label">
                AIHire-AMCI Candidate Match
              </div>

              <h2>
                {Math.round(result.match_score)}%
              </h2>

              <p>
                Candidate alignment for{" "}
                <strong>{result.job_role}</strong>
              </p>

              <div className="score-progress">

                <div
                  className="score-progress-fill"
                  style={{
                    width: `${Math.min(
                      result.match_score,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            <div className="score-icon">
              <Target size={32} />
            </div>

          </div>


          {/* SKILL EVIDENCE */}

          <div className="result-card">

            <div className="result-card-header">

              <div>

                <h2>
                  Skill Evidence Profile
                </h2>

                <p>
                  Skills detected from the uploaded resume
                  against the selected job role.
                </p>

              </div>

              <Brain size={22} />

            </div>


            <div className="skill-list">

              {result.matched_skills.map(
                (skill) => (

                  <SkillRow
                    key={skill}
                    skill={skill}
                    score={`${getSkillScore(skill)}%`}
                    status="Matched"
                  />

                )
              )}


              {result.missing_skills.map(
                (skill) => (

                  <SkillRow
                    key={skill}
                    skill={skill}
                    score="25%"
                    status="Needs Verification"
                    warning
                  />

                )
              )}

            </div>

          </div>


          {/* RESULT GRID */}

          <div className="result-grid">

            {/* COVERAGE */}

            <div className="result-card">

              <div className="result-card-header">

                <div>

                  <h2>
                    Job Requirement Coverage
                  </h2>

                  <p>
                    Skills identified from the candidate
                    resume.
                  </p>

                </div>

                <Briefcase size={21} />

              </div>


              <div className="coverage-grid">

                <CoverageItem
                  value={
                    result.matched_skills.length +
                    result.missing_skills.length
                  }
                  label="Required Skills"
                />

                <CoverageItem
                  value={result.matched_skills.length}
                  label="Matched Skills"
                />

                <CoverageItem
                  value={result.missing_skills.length}
                  label="Skill Gaps"
                />

                <CoverageItem
                  value={`${Math.round(
                    result.skill_coverage
                  )}%`}
                  label="Coverage"
                />

              </div>

            </div>


            {/* RECOMMENDATION */}

            <div className="result-card">

              <div className="result-card-header">

                <div>

                  <h2>
                    AI Recommendation
                  </h2>

                  <p>
                    Explainable candidate assessment.
                  </p>

                </div>

                <ShieldCheck size={21} />

              </div>


              <div className="recommendation-list">

                <div className="recommendation positive">

                  <CheckCircle2 size={18} />

                  {result.recommendation}

                </div>


                {result.explanation.map(
                  (item, index) => (

                    <div
                      className="recommendation positive"
                      key={index}
                    >

                      <CheckCircle2 size={18} />

                      {item}

                    </div>

                  )
                )}

              </div>

            </div>

          </div>


          {/* NEXT STEP */}

          <div className="next-step-card">

            <div>

              <span>
                Next AIHire-AMCI stage
              </span>

              <h2>
                Start Adaptive Interview
              </h2>

              <p>
                Interview questions will use the candidate's
                resume, job requirements and detected skill gaps
                to determine the next assessment stage.
              </p>

            </div>

            <button className="next-button">

              Start Interview

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      )}

    </div>
  );
}


/* SKILL ROW */

function SkillRow({
  skill,
  score,
  status,
  warning,
}) {

  return (

    <div className="skill-row">

      <div className="skill-name">

        <strong>
          {skill}
        </strong>

        <span
          className={
            warning
              ? "warning-text"
              : ""
          }
        >
          {status}
        </span>

      </div>


      <div className="skill-bar">

        <div
          className="skill-fill"
          style={{
            width: score,
          }}
        />

      </div>


      <strong className="skill-score">
        {score}
      </strong>

    </div>

  );
}


/* COVERAGE ITEM */

function CoverageItem({
  value,
  label,
}) {

  return (

    <div className="coverage-item">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>

  );
}


export default ResumeScreening;
