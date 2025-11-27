import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";
import Logo from "./Logo";
import "../styles/forgot-password.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message);

        // Store reset token and navigate to OTP verification
        if (result.resetToken) {
          localStorage.setItem("resetToken", result.resetToken);
          localStorage.setItem("resetEmail", email);

          // Navigate to OTP verification after 2 seconds
          setTimeout(() => {
            navigate("/verify-otp");
          }, 2000);
        }
      } else {
        setMessage(result.error);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
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

  return (
    <div className="forgot-password-container">
      {/* Same animated background as login */}
      <div className="ocean-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>

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

        <div className="coral-silhouettes">
          <div className="coral coral1"></div>
          <div className="coral coral2"></div>
          <div className="coral coral3"></div>
        </div>

        <div className="light-rays">
          <div className="ray ray1"></div>
          <div className="ray ray2"></div>
          <div className="ray ray3"></div>
        </div>
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
      </div>

      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <h1>Reset Password</h1>
          <p>Enter your email address and we'll send you a verification code</p>
        </div>

        <div className="forgot-password-body">
          {message && (
            <div className={`message ${isSuccess ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="input-group">
                <div className="input-icon">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`forgot-submit ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="button-icon" />
                    Send Reset Code
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">📧</div>
              <h3>Check Your Email!</h3>
              <p>
                We've sent a 6-digit verification code to{" "}
                <strong>{email}</strong>
              </p>
              <p className="redirect-message">
                Redirecting to verification page...
              </p>
            </div>
          )}

          <div className="forgot-password-footer">
            <p className="back-to-login">
              Remember your password? <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
