import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiLock, FiLogIn, FiArrowLeft } from "react-icons/fi";
import Logo from "../Logo";

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Add this import from react-router-dom
  const { login, csrfToken } = useAuth();

  // Fetch CSRF token when component mounts
  useEffect(() => {
    document.title = "Sign in to DeepCoral";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="8"
              />
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

  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .login-header {
    background: linear-gradient(135deg, rgb(5, 113, 180) 0%,rgb(0, 94, 153) 100%);
    padding: 30px;
    text-align: center;
    color: white;
  }

  .login-header h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .login-header p {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }

  .login-body {
    padding: 30px;
  }

  .login-message {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 24px;
    text-align: center;
    font-size: 14px;
  }

  .login-message.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  .login-message.error {
    background-color: #ffebee;
    color: #c62828;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    color:rgb(61, 175, 245);
    font-size: 18px;
  }

  .input-group input {
    width: 100%;
    padding: 14px 16px 14px 40px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
  }

  .input-group input:focus {
    outline: none;
    border-color: rgb(0, 94, 153);
    box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);
  }

  .login-button {
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
  }

  .login-button:hover:not(.loading) {
    background: linear-gradient(135deg, rgb(0, 94, 153) 0%, #00838f 100%);
    box-shadow: 0 4px 12px rgba(0, 172, 193, 0.2);
  }

  .login-button.loading {
    background: rgb(0, 94, 153);
    cursor: not-allowed;
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

  .login-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 13px;
    color: #616161;
  }

  .forgot-password {
    color: #26c6da;
    text-decoration: none;
    font-weight: 500;
    display: block;
    margin-bottom: 16px;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  .signup-prompt a {
    color: #26c6da;
    text-decoration: none;
    font-weight: 500;
  }

  .signup-prompt a:hover {
    text-decoration: underline;
  }
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Login;
