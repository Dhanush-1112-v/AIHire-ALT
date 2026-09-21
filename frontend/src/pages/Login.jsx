import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary frontend login.
    // Real authentication will be connected to FastAPI later.
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <section className="auth-brand-panel">

        <div className="brand-content">

          <div className="brand-logo">
            <div className="brand-icon">
              <BrainCircuit size={25} />
            </div>

            <span>AIHire</span>
          </div>

          <div className="brand-main">

            <div className="eyebrow">
              <Sparkles size={15} />
              AI-Powered Interview Platform
            </div>

            <h1>
              Hire smarter.
              <br />
              <span>Assess better.</span>
            </h1>

            <p>
              AIHire helps candidates and organizations make smarter
              interview decisions using AI, NLP, speech analysis and
              intelligent assessment.
            </p>

            <div className="feature-list">

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>AI-Powered Assessment</strong>
                  <span>Evaluate technical and communication skills.</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>Secure & Intelligent</strong>
                  <span>Designed for reliable candidate assessment.</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <BrainCircuit size={18} />
                </div>

                <div>
                  <strong>Personalized Insights</strong>
                  <span>Discover strengths, gaps and improvement areas.</span>
                </div>
              </div>

            </div>

          </div>

          <div className="brand-footer">
            AIHire • Smart Interview & Candidate Assessment
          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="mobile-brand">
            <div className="brand-icon">
              <BrainCircuit size={22} />
            </div>

            <span>AIHire</span>
          </div>

          <div className="auth-heading">
            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your AIHire dashboard.
            </p>
          </div>


          <form onSubmit={handleSubmit} className="auth-form">

            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="form-group">

              <div className="label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    alert("Password recovery will be connected later.")
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>


            {/* REMEMBER */}
            <label className="remember-row">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              <span>Remember me</span>

            </label>


            {/* ERROR */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}


            {/* LOGIN */}
            <button
              type="submit"
              className="primary-button"
            >
              <span>Sign in</span>
              <ArrowRight size={19} />
            </button>

          </form>


          {/* REGISTER */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="register-prompt">

            <span>Don't have an account?</span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          <div className="security-note">

            <ShieldCheck size={16} />

            <span>
              Your information is protected and securely handled.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;