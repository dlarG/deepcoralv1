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
import "../styles/register.css";

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
  const [bubbles, setBubbles] = useState([]);
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  // Generate bubbles for animation
  useEffect(() => {
    document.title = "Create Account - DeepCoral";

    // Generate random bubbles
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 20; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 50 + 15, // 15-65px
          left: Math.random() * 100, // 0-100%
          animationDuration: Math.random() * 12 + 8, // 8-20s
          animationDelay: Math.random() * 6, // 0-6s
          opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();

    // Regenerate bubbles every 25 seconds for variety
    const interval = setInterval(generateBubbles, 25000);
    return () => clearInterval(interval);
  }, []);

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

    const strengthMap = {
      0: { label: "Very Weak", color: "#ef4444" },
      1: { label: "Weak", color: "#f59e0b" },
      2: { label: "Fair", color: "#eab308" },
      3: { label: "Good", color: "#84cc16" },
      4: { label: "Strong", color: "#22c55e" },
      5: { label: "Very Strong", color: "#16a34a" },
    };

    const current = strengthMap[strength] || strengthMap[0];

    return {
      score: strength,
      label: current.label,
      percentage: (strength / 5) * 100,
      color: current.color,
    };
  };

  // Password match validation
  const getPasswordMatch = () => {
    if (!form.confirmPassword) return null;
    return form.password === form.confirmPassword;
  };

  // Fetch CSRF token when component mounts
  useEffect(() => {
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
      axios.post(
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

      setMessage("Registration successful! Redirecting to login...");
      // Clear form on successful registration
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
      });

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
      {/* Animated Ocean Background */}
      <div className="ocean-background">
        {/* Gradient waves */}
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>

        {/* Floating particles */}
        <div className="particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        {/* Animated bubbles */}
        <div className="bubbles-container">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                animationDuration: `${bubble.animationDuration}s`,
                animationDelay: `${bubble.animationDelay}s`,
                opacity: bubble.opacity,
              }}
            />
          ))}
        </div>

        {/* Coral silhouettes */}
        <div className="coral-silhouettes">
          <div className="coral coral1"></div>
          <div className="coral coral2"></div>
          <div className="coral coral3"></div>
          <div className="coral coral4"></div>
        </div>

        {/* Light rays */}
        <div className="light-rays">
          <div className="ray ray1"></div>
          <div className="ray ray2"></div>
          <div className="ray ray3"></div>
          <div className="ray ray4"></div>
        </div>

        {/* Seaweed animation */}
        <div className="seaweed-container">
          <div className="seaweed seaweed1"></div>
          <div className="seaweed seaweed2"></div>
          <div className="seaweed seaweed3"></div>
        </div>
      </div>

      <div className="register-card">
        {/* Enhanced header with marine theme */}
        <div className="register-header">
          <Link to="/" className="back-button">
            <FiArrowLeft />
          </Link>
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <h1>Join Coral Reef Portal</h1>
          <p>Create your account to start conserving marine life</p>
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

            <div className="name-fields">
              <div className="input-group">
                <div className="input-icon">
                  <FiUser />
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
                  <FiUser />
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

            <div className="input-group">
              <div className="input-icon">
                <FiEdit2 />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
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
                placeholder="Create a strong password"
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

            {/* Enhanced Password Strength Meter */}
            {form.password && (
              <div className="password-meter">
                <div className="meter-header">
                  <span className="meter-title">Password Strength</span>
                  <span
                    className="strength-badge"
                    style={{
                      backgroundColor: passwordStrength.color,
                      color: "white",
                    }}
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
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[A-Z]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[A-Z]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>Uppercase</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[a-z]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[a-z]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>Lowercase</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[0-9]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[0-9]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>Number</span>
                  </div>
                  <div
                    className={`requirement ${
                      /[^A-Za-z0-9]/.test(form.password) ? "met" : ""
                    }`}
                  >
                    {/[^A-Za-z0-9]/.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>Special char</span>
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
                placeholder="Confirm your password"
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

            {/* Enhanced Password Match Indicator */}
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
                      ? "Passwords match perfectly!"
                      : "Passwords don't match"}
                  </span>
                </div>
              </div>
            )}

            <div className="captcha-container">
              <div className="captcha-header">
                <span className="captcha-title">Security Verification</span>
                <span className="captcha-subtitle">
                  Please verify you're human
                </span>
              </div>
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
                isLoading ||
                !passwordMatch ||
                passwordStrength.score < 3 ||
                !captchaValue
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
                  Create Account
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p className="login-prompt">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
