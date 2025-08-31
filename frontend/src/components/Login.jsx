import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiLock,
  FiLogIn,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Logo from "./Logo";
import "../styles/login.css";

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const navigate = useNavigate();
  const { login, csrfToken } = useAuth();

  // Generate bubbles for animation
  useEffect(() => {
    document.title = "Sign in to DeepCoral";

    // Generate random bubbles
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 60 + 20, // 20-80px
          left: Math.random() * 100, // 0-100%
          animationDuration: Math.random() * 10 + 10, // 10-20s
          animationDelay: Math.random() * 5, // 0-5s
          opacity: Math.random() * 0.7 + 0.3, // 0.3-1
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();

    // Regenerate bubbles every 20 seconds for variety
    const interval = setInterval(generateBubbles, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(form);

      if (result.success) {
        setMessage("Login successful");
        navigate(
          result.redirectTo ||
            `/${result.user?.roletype?.toLowerCase()}-dashboard` ||
            "/"
        );
      } else {
        setMessage(result.error || "Login failed");
      }
    } catch (err) {
      setMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="ocean-background">
        {/* Gradient waves */}
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>

        {/* Floating particles */}
        <div className="particles">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
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
        </div>

        {/* Light rays */}
        <div className="light-rays">
          <div className="ray ray1"></div>
          <div className="ray ray2"></div>
          <div className="ray ray3"></div>
        </div>
      </div>

      <div className="login-card">
        {/* Coral reef header */}
        <div className="login-header">
          <Link to="/" className="back-button">
            <FiArrowLeft />
          </Link>
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <h1>Coral Reef Portal</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <div className="login-body">
          {message && (
            <div
              className={`login-message ${
                message.includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Password"
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

            <button
              type="submit"
              disabled={isLoading}
              className={`login-button ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiLogIn className="button-icon" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/" className="forgot-password">
              Forgot password?
            </Link>
            <p className="signup-prompt">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
