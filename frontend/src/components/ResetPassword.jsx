import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiLogIn,
} from "react-icons/fi";
import Logo from "./Logo";
import "../styles/reset-password.css";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [bubbles, setBubbles] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0); // Add countdown state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const resetToken = localStorage.getItem("resetToken");
  const resetEmail = localStorage.getItem("resetEmail");

  useEffect(() => {
    document.title = "Reset Password - DeepCoral";

    // Generate random bubbles
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 60 + 20,
          left: Math.random() * 100,
          animationDuration: Math.random() * 10 + 10,
          animationDelay: Math.random() * 5,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
    const interval = setInterval(generateBubbles, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Redirect if no reset token
    if (!resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, [resetToken, navigate]);

  // Countdown effect for redirect after success
  useEffect(() => {
    let countdownTimer;
    if (isSuccess && redirectCountdown > 0) {
      countdownTimer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && redirectCountdown === 0) {
      // Navigate to login after countdown
      navigate("/login", { replace: true });
    }

    return () => {
      if (countdownTimer) {
        clearTimeout(countdownTimer);
      }
    };
  }, [isSuccess, redirectCountdown, navigate]);

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const getStrengthColor = (score) => {
    if (score <= 2) return "#ef4444";
    if (score <= 3) return "#f59e0b";
    if (score <= 4) return "#eab308";
    return "#10b981";
  };

  const getStrengthText = (score) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      setMessage("Please choose a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(
        resetToken,
        formData.newPassword,
        formData.confirmPassword
      );

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message);
        setRedirectCountdown(5); // Start 5-second countdown

        // Clean up stored data immediately to prevent navigation issues
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetEmail");
      } else {
        setMessage(result.error);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setMessage("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRedirect = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="reset-password-container">
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

      <div className="reset-password-card">
        <div className="reset-password-header">
          {!isSuccess && (
            <Link to="/verify-otp" className="back-button">
              <FiArrowLeft />
            </Link>
          )}
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <div className="lock-icon">{isSuccess ? "🎉" : "🔐"}</div>
          <h1>
            {isSuccess ? "Password Reset Successful!" : "Create New Password"}
          </h1>
          <p>
            {isSuccess
              ? "Your password has been successfully updated"
              : resetEmail
              ? `Enter your new password for ${resetEmail}`
              : "Enter your new password"}
          </p>
        </div>

        <div className="reset-password-body">
          {message && (
            <div
              className={`reset-password-message ${
                isSuccess ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="input-group">
                <label className="input-label">New Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {formData.newPassword && (
                <div className="password-strength">
                  <span className="strength-label">Password Strength:</span>
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className={`strength-bar ${
                          passwordStrength.score >= bar ? "active" : ""
                        } ${
                          passwordStrength.score <= 2
                            ? "weak"
                            : passwordStrength.score <= 3
                            ? "medium"
                            : "strong"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`strength-text ${
                      passwordStrength.score <= 2
                        ? "weak"
                        : passwordStrength.score <= 3
                        ? "medium"
                        : "strong"
                    }`}
                  >
                    {getStrengthText(passwordStrength.score)}
                  </span>
                </div>
              )}

              {passwordStrength.feedback.length > 0 && (
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  {[
                    {
                      text: "At least 8 characters",
                      met: formData.newPassword.length >= 8,
                    },
                    {
                      text: "One lowercase letter",
                      met: /[a-z]/.test(formData.newPassword),
                    },
                    {
                      text: "One uppercase letter",
                      met: /[A-Z]/.test(formData.newPassword),
                    },
                    {
                      text: "One number",
                      met: /\d/.test(formData.newPassword),
                    },
                    {
                      text: "One special character",
                      met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
                    },
                  ].map((req, index) => (
                    <div
                      key={index}
                      className={`requirement ${req.met ? "met" : "unmet"}`}
                    >
                      <span className="requirement-icon">
                        {req.met ? "✅" : "❌"}
                      </span>
                      {req.text}
                    </div>
                  ))}
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <FiLock />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <div className="reset-password-message error">
                    Passwords do not match
                  </div>
                )}

              <button
                type="submit"
                disabled={isLoading || passwordStrength.score < 3}
                className={`reset-password-button ${
                  isLoading ? "loading" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <FiCheck className="button-icon" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="success-animation">
              <div className="success-icon">🎉</div>
              <h3 className="success-title">Password Reset Complete!</h3>
              <p className="success-message">
                Your password has been successfully updated. You can now log in
                with your new password.
              </p>

              {redirectCountdown > 0 ? (
                <p className="redirect-message">
                  Redirecting to login in {redirectCountdown} second
                  {redirectCountdown !== 1 ? "s" : ""}...
                </p>
              ) : (
                <p className="redirect-message">Redirecting to login...</p>
              )}

              <button onClick={handleManualRedirect} className="success-button">
                <FiLogIn className="button-icon" />
                Go to Login Now
              </button>
            </div>
          )}

          {!isSuccess && (
            <div className="reset-password-footer">
              <div className="footer-link">
                Remember your password? <Link to="/login">Back to Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
