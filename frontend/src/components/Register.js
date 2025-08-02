import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEdit2,
  FiArrowRight,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "./Logo";

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("one special character");

    return errors.length ? `Password must contain: ${errors.join(", ")}` : null;
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        label: "Very Weak",
        percentage: 0,
        color: "#ef4444",
      };
    }

    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    const strength = checks.filter(Boolean).length;

    // Fixed: Make sure arrays have correct indexes
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["red", "#f59e0b", "#eab308", "#84cc16", "#22c55e"];

    return {
      score: strength,
      label: labels[strength] || "Very Strong",
      percentage: (strength / 5) * 100,
      color: colors[strength] || "light-green",
    };
  };

  // Password match validation
  const getPasswordMatch = () => {
    if (!form.confirmPassword) return null;
    return form.password === form.confirmPassword;
  };

  // Fetch CSRF token when component mounts
  useEffect(() => {
    document.title = "Create an Account";
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/csrf-token");
        setCsrfToken(response.data.csrf_token);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
        setMessage(
          "Failed to initialize security token. Please refresh the page."
        );
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Client-side validation
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setMessage(passwordError);
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!captchaValue) {
      setMessage("Please complete the CAPTCHA");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        {
          username: form.username,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
          captcha: captchaValue,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      setMessage(res.data.message);
      // Clear form on successful registration
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
      });

      // Optionally redirect to login after successful registration
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const passwordMatch = getPasswordMatch();

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Coral reef header */}
        <div className="register-header">
          <Link to="/" className="back-button">
            <FiArrowLeft />
          </Link>
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <h1>Join Coral Reef Portal</h1>
          <p>Create your account to get started</p>
        </div>

        <div className="register-body">
          {message && (
            <div
              className={`register-message ${
                message.includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <input type="hidden" name="csrf_token" value={csrfToken} />

            <div className="input-group">
              <div className="input-icon">
                <FiUser />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 8 characters)"
                value={form.password}
                onChange={handleChange}
                required
                minLength="8"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {form.password && (
              <div className="password-meter">
                <div className="meter-label">
                  <span>Password Strength: </span>
                  <span
                    className="strength-text"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="meter-bar">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${passwordStrength.percentage}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
                <div className="password-requirements">
                  <div
                    className={`requirement ${
                      form.password.length >= 8 ? "met" : ""
                    }`}
                  >
                    {form.password.length >= 8 ? <FiCheck /> : <FiX />}
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[A-Z]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[A-Z]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>One uppercase letter</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[a-z]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[a-z]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>One lowercase letter</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[0-9]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[0-9]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>One number</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[^A-Za-z0-9]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[^A-Za-z0-9]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>One special character</span>
                  </div>
                </div>
              </div>
            )}

            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {form.confirmPassword && (
              <div className="password-match">
                <div
                  className={`match-indicator ${
                    passwordMatch ? "match" : "no-match"
                  }`}
                >
                  {passwordMatch ? <FiCheck /> : <FiX />}
                  <span>
                    {passwordMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              </div>
            )}

            <div className="name-fields">
              <div className="input-group">
                <div className="input-icon">
                  <FiEdit2 />
                </div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <FiEdit2 />
                </div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="captcha-container">
              <label className="captcha-label">
                Please verify you are human
              </label>
              <div className="captcha-widget">
                <ReCAPTCHA
                  sitekey="6LdXDYkrAAAAAO83PKhXnlg3zb3tCBN0qgCTYg0M"
                  onChange={(value) => setCaptchaValue(value)}
                  theme="light"
                  size="normal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isLoading || !passwordMatch || passwordStrength.score < 3
              }
              className={`register-button ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Register <FiArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p className="login-prompt">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS Styles
const styles = `
  .back-button {
    color: white;
    font-size: 24px;
    text-decoration: none;
    transition: color 0.3s;
  }
    
  .back-button:hover {
    color: #26c6da;
  }

  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .register-card {
    width: 100%;
    max-width: 580px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .register-header {
    background: linear-gradient(135deg, rgb(5, 113, 180) 0%,rgb(0, 94, 153) 100%);
    padding: 20px;
    text-align: center;
    color: white;
  }

  .register-header h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .register-header p {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }

  .register-body {
    padding: 30px;
  }

  .register-message {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 24px;
    text-align: center;
    font-size: 14px;
  }

  .register-message.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .register-message.error {
    background-color: #ffebee;
    color: #c62828;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .name-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .input-group {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(61, 175, 245);
    font-size: 18px;
    z-index: 2;
  }

  .input-group input {
    width: 100%;
    padding: 14px 16px 14px 40px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
    padding-right: 45px; /* Space for password toggle */
  }

  .input-group input:focus {
    outline: none;
    border-color: rgb(0, 94, 153);
    box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9e9e9e;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .password-toggle:hover {
    color: rgb(61, 175, 245);
    background-color: rgba(61, 175, 245, 0.1);
  }

  .password-toggle:focus {
    outline: none;
    color: rgb(0, 94, 153);
    background-color: rgba(0, 94, 153, 0.1);
  }

  /* Password Strength Meter */
  .password-meter {
    background: #f8fffe;
    border: 1px solid #e0f2f1;
    border-radius: 8px;
    padding: 12px;
    margin-top: -8px;
  }

  .meter-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .meter-label span:first-child {
    color: #666;
    font-weight: 500;
  }

  .strength-text {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
  }

  .meter-bar {
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .meter-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 3px;
  }

  .password-requirements {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .requirement {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #666;
  }

  .requirement.met {
    color: #22c55e;
  }

  .requirement svg {
    font-size: 14px;
    flex-shrink: 0;
  }

  .requirement.met svg {
    color: #22c55e;
  }

  .requirement:not(.met) svg {
    color: #ef4444;
  }

  /* Password Match Indicator */
  .password-match {
    margin-top: -8px;
  }

  .match-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .match-indicator.match {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .match-indicator.no-match {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .match-indicator svg {
    font-size: 16px;
    flex-shrink: 0;
  }

  .register-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #26c6da 0%, rgb(0, 94, 153) 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
    margin-top: 8px;
  }

  .register-button:hover:not(.loading):not(:disabled) {
    background: linear-gradient(135deg, rgb(0, 94, 153) 0%, #00838f 100%);
    box-shadow: 0 4px 12px rgba(0, 172, 193, 0.2);
  }

  .register-button.loading,
  .register-button:disabled {
    background: #9e9e9e;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .button-icon {
    font-size: 18px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .register-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: #616161;
  }

  .login-prompt a {
    color: #26c6da;
    text-decoration: none;
    font-weight: 500;
  }

  .login-prompt a:hover {
    text-decoration: underline;
  }

  /* Redesigned captcha styles */
  .captcha-container {
    margin: 12px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 12px 0;
    background: #f1fcfd;
    border-radius: 8px;
    border: 1px solid #b2ebf2;
  }

  .captcha-label {
    font-size: 13px;
    color: #0097a7;
    font-weight: 500;
    margin-left: 12px;
    margin-bottom: 2px;
  }

  .captcha-widget {
    margin-left: 12px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    min-height: 78px;
  }

  @media (max-width: 500px) {
    .name-fields {
      grid-template-columns: 1fr;
    }
    
    .register-card {
      max-width: 100%;
    }
    
    .register-header {
      padding: 24px;
    }
    
    .register-body {
      padding: 24px;
    }

    .captcha-widget {
      margin-left: 0;
    }

    .password-requirements {
      grid-template-columns: 1fr;
    }

    .input-group input {
      padding: 12px 14px 12px 38px;
      padding-right: 42px;
    }

    .input-icon {
      left: 10px;
      font-size: 16px;
    }

    .password-toggle {
      right: 10px;
      font-size: 16px;
    }
  }
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Register;
