import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Backend registration will be connected later.
    navigate("/login");
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
              <CheckCircle2 size={15} />
              Build Your Interview Profile
            </div>

            <h1>
              Start your
              <br />
              <span>smart assessment journey.</span>
            </h1>

            <p>
              Create your AIHire account and experience an intelligent
              interview platform designed to evaluate skills,
              communication and technical performance.
            </p>

            <div className="feature-list">

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Resume-Based Assessment</strong>
                  <span>
                    Let AI understand your skills and experience.
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Adaptive AI Interview</strong>
                  <span>
                    Questions can adapt to your profile and responses.
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Personalized Feedback</strong>
                  <span>
                    Understand your strengths and areas to improve.
                  </span>
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

            <h2>Create your account</h2>

            <p>
              Set up your profile to get started with AIHire.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* NAME */}
            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="input-wrapper">

                <User size={19} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  id="register-email"
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

              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}


            {/* REGISTER */}
            <button
              type="submit"
              className="primary-button"
            >
              <span>Create account</span>
              <ArrowRight size={19} />
            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="register-prompt">

            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
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

export default Register;