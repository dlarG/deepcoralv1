import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowLeft, FiRefreshCw, FiCheck } from "react-icons/fi";
import Logo from "./Logo";
import "../styles/verify-otp.css";

function VerifyOTP() {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { verifyResetOTP, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const resetToken = localStorage.getItem("resetToken");
  const resetEmail = localStorage.getItem("resetEmail");

  useEffect(() => {
    // Redirect if no reset token
    if (!resetToken || !resetEmail) {
      navigate("/forgot-password");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetToken, resetEmail, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtpCode(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpCode.join("");

    if (fullOtp.length !== 6) {
      setMessage("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await verifyResetOTP(resetToken, fullOtp);

      if (result.success) {
        setIsVerified(true);
        setMessage("Code verified successfully!");

        // Navigate to reset password page
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
      } else {
        setMessage(result.error);
        // Clear the OTP inputs on error
        setOtpCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setMessage("Verification failed. Please try again.");
      setOtpCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setMessage("");

    try {
      const result = await forgotPassword(resetEmail);

      if (result.success) {
        if (result.resetToken) {
          localStorage.setItem("resetToken", result.resetToken);
        }
        setMessage("New verification code sent!");
        setTimeLeft(900);
        setCanResend(false);
        setOtpCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setMessage(result.error);
      }
    } catch (err) {
      setMessage("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
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
      </div>

      <div className="verify-otp-card">
        <div className="verify-otp-header">
          <Link to="/forgot-password" className="back-button">
            <FiArrowLeft />
          </Link>
          <div className="auth-logo-container">
            <Logo variant="auth" type="image" theme="dark" />
          </div>
          <h1>Enter Verification Code</h1>
          <p>
            We sent a 6-digit code to <strong>{resetEmail}</strong>
          </p>
        </div>

        <div className="verify-otp-body">
          {message && (
            <div className={`message ${isVerified ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {!isVerified ? (
            <form onSubmit={handleSubmit} className="verify-otp-form">
              <div className="otp-input-group" onPaste={handlePaste}>
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    autoComplete="off"
                  />
                ))}
              </div>

              <div className="timer-section">
                {timeLeft > 0 ? (
                  <p className="timer">
                    Code expires in:{" "}
                    <span className="time">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="expired">Code has expired</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.join("").length !== 6}
                className={`verify-button ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheck className="button-icon" />
                    Verify Code
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className={`resend-button ${!canResend ? "disabled" : ""}`}
              >
                <FiRefreshCw className="button-icon" />
                Resend Code
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Code Verified!</h3>
              <p>Redirecting to password reset...</p>
            </div>
          )}

          <div className="verify-otp-footer">
            <p className="back-to-login">
              Remember your password? <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
