import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  Mic,
  Code2,
  BarChart3,
  LogOut,
  Bell,
  Upload,
  PlayCircle,
  FileBarChart,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <div className="logo-icon">
            <BrainCircuit size={22} />
          </div>

          <span className="logo-text">AIHire</span>
        </div>

        <div className="sidebar-section-title">
          Main Menu
        </div>

        <nav className="sidebar-menu">

          <button className="sidebar-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/resume-screening")}
          >
            <FileText size={18} />
            <span>Resume Screening</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/ai-interview")}
          >
            <Mic size={18} />
            <span>AI Interview</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/coding-assessment")}
          >
            <Code2 size={18} />
            <span>Coding Assessment</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/results")}
          >
            <BarChart3 size={18} />
            <span>Results</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <div className="breadcrumb">
            AIHire <span> / </span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">

            <button className="notification-button">
              <Bell size={17} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile">

              <div className="user-avatar">
                SD
              </div>

              <div className="user-info">
                <span className="user-name">
                  Candidate
                </span>

                <span className="user-role">
                  Interview Participant
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="dashboard-content">

          {/* WELCOME */}

          <div className="welcome-section">

            <div>
              <h1 className="welcome-title">
                Welcome back, Candidate
              </h1>

              <p className="welcome-subtitle">
                Track your interview preparation, assessments and AI-generated insights.
              </p>
            </div>

            <div className="date-card">
              AI Assessment Dashboard
            </div>

          </div>


          {/* STATISTICS */}

          <div className="stats-grid">

            <StatCard
              label="Resume Match"
              value="--"
              description="Upload resume to analyze"
              icon={<FileText size={18} />}
              type="blue"
            />

            <StatCard
              label="Interview Status"
              value="Ready"
              description="AI interview not started"
              icon={<Mic size={18} />}
              type="purple"
            />

            <StatCard
              label="Coding Assessment"
              value="Pending"
              description="Complete technical test"
              icon={<Code2 size={18} />}
              type="green"
            />

            <StatCard
              label="Overall Score"
              value="--"
              description="Generated after assessment"
              icon={<BarChart3 size={18} />}
              type="orange"
            />

          </div>


          {/* FIRST ROW */}

          <div className="dashboard-grid">

            {/* WORKFLOW */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2 className="card-title">
                    Assessment Workflow
                  </h2>

                  <p className="card-subtitle">
                    Complete each stage to generate your final candidate profile.
                  </p>
                </div>

                <Sparkles size={19} color="#5968ff" />

              </div>


              <div className="workflow">

                <WorkflowStep
                  icon={<FileText size={17} />}
                  name="Resume"
                  completed
                />

                <WorkflowStep
                  icon={<BrainCircuit size={17} />}
                  name="AI Matching"
                  current
                />

                <WorkflowStep
                  icon={<Mic size={17} />}
                  name="Interview"
                />

                <WorkflowStep
                  icon={<Code2 size={17} />}
                  name="Coding"
                />

                <WorkflowStep
                  icon={<BarChart3 size={17} />}
                  name="Final Report"
                />

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2 className="card-title">
                    Quick Actions
                  </h2>

                  <p className="card-subtitle">
                    Start your assessment
                  </p>
                </div>

              </div>


              <div className="quick-actions">

                <button
                  className="action-button"
                  onClick={() => navigate("/resume-screening")}
                >

                  <div className="action-icon">
                    <Upload size={17} />
                  </div>

                  <div className="action-text">
                    <strong>Upload Resume</strong>
                    <span>Analyze your profile</span>
                  </div>

                  <ArrowUpRight size={15} />

                </button>


                <button
                  className="action-button"
                  onClick={() => navigate("/interview")}
                >

                  <div className="action-icon">
                    <PlayCircle size={17} />
                  </div>

                  <div className="action-text">
                    <strong>Start Interview</strong>
                    <span>Practice with AI</span>
                  </div>

                  <ArrowUpRight size={15} />

                </button>


                <button
                  className="action-button"
                  onClick={() => navigate("/coding-assessment")}
                >

                  <div className="action-icon">
                    <Code2 size={17} />
                  </div>

                  <div className="action-text">
                    <strong>Coding Test</strong>
                    <span>Test technical skills</span>
                  </div>

                  <ArrowUpRight size={15} />

                </button>


                <button
                  className="action-button"
                  onClick={() => navigate("/results")}
                >

                  <div className="action-icon">
                    <FileBarChart size={17} />
                  </div>

                  <div className="action-text">
                    <strong>View Report</strong>
                    <span>See assessment results</span>
                  </div>

                  <ArrowUpRight size={15} />

                </button>

              </div>

            </div>

          </div>


          {/* SECOND ROW */}

          <div className="dashboard-grid">

            {/* SKILLS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2 className="card-title">
                    Assessment Areas
                  </h2>

                  <p className="card-subtitle">
                    Your performance will be evaluated across these areas.
                  </p>
                </div>

                <ShieldCheck size={19} color="#5968ff" />

              </div>


              <ProgressItem
                name="Resume & Job Matching"
                percent="0%"
              />

              <ProgressItem
                name="Technical Interview"
                percent="0%"
              />

              <ProgressItem
                name="Communication"
                percent="0%"
              />

              <ProgressItem
                name="Coding Skills"
                percent="0%"
              />

            </div>


            {/* RECENT ACTIVITY */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2 className="card-title">
                    Recent Activity
                  </h2>

                  <p className="card-subtitle">
                    Your latest assessment activity
                  </p>
                </div>

                <Clock3 size={18} color="#667085" />

              </div>


              <div className="activity-list">

                <ActivityItem
                  icon={<CheckCircle2 size={16} />}
                  title="AIHire account created"
                  time="Ready to begin"
                />

                <ActivityItem
                  icon={<FileText size={16} />}
                  title="Resume screening"
                  time="Waiting for resume"
                />

                <ActivityItem
                  icon={<Mic size={16} />}
                  title="AI interview"
                  time="Not started"
                />

                <ActivityItem
                  icon={<Code2 size={16} />}
                  title="Coding assessment"
                  time="Not started"
                />

              </div>

            </div>

          </div>


          {/* FOOTER INFO */}

          <div
            className="dashboard-card"
            style={{ marginTop: "20px" }}
          >

            <div className="card-header">

              <div>
                <h2 className="card-title">
                  How AIHire Works
                </h2>

                <p className="card-subtitle">
                  AI-powered candidate assessment from profile to personalized insights.
                </p>
              </div>

              <BrainCircuit size={21} color="#5968ff" />

            </div>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "13px",
                lineHeight: "1.7",
              }}
            >
              AIHire combines resume-job semantic matching, adaptive AI interviews,
              speech-to-text processing, answer evaluation, communication analysis,
              coding assessment and AI-assisted assessment monitoring to create a
              unified candidate assessment profile.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================================
   STAT CARD
   ================================ */

function StatCard({
  label,
  value,
  description,
  icon,
  type,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <span className="stat-label">
          {label}
        </span>

        <div className={`stat-icon ${type}`}>
          {icon}
        </div>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-description">
        {description}
      </div>

    </div>
  );
}


/* ================================
   WORKFLOW STEP
   ================================ */

function WorkflowStep({
  icon,
  name,
  completed = false,
  current = false,
}) {
  return (
    <div
      className={`workflow-step ${
        completed ? "completed" : ""
      } ${current ? "current" : ""}`}
    >

      <div className="workflow-line"></div>

      <div className="workflow-circle">
        {completed ? (
          <CheckCircle2 size={18} />
        ) : (
          icon
        )}
      </div>

      <div className="workflow-name">
        {name}
      </div>

    </div>
  );
}


/* ================================
   PROGRESS ITEM
   ================================ */

function ProgressItem({
  name,
  percent,
}) {
  const numericValue = parseInt(percent) || 0;

  return (
    <div className="progress-item">

      <div className="progress-info">

        <span className="progress-name">
          {name}
        </span>

        <span className="progress-percent">
          {percent}
        </span>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${numericValue}%`,
          }}
        ></div>

      </div>

    </div>
  );
}


/* ================================
   ACTIVITY ITEM
   ================================ */

function ActivityItem({
  icon,
  title,
  time,
}) {
  return (
    <div className="activity-item">

      <div className="activity-icon">
        {icon}
      </div>

      <div className="activity-text">

        <strong>
          {title}
        </strong>

        <span>
          {time}
        </span>

      </div>

    </div>
  );
}


export default Dashboard;