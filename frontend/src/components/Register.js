import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEdit2, FiArrowRight } from "react-icons/fi";
import ReCAPTCHA from "react-google-recaptcha";

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
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
    if (!captchaValue) {
      setMessage("Please complete the CAPTCHA");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        {
          ...form,
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

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Coral reef header */}
        <div className="register-header">
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
                type="password"
                name="password"
                placeholder="Password (min 8 characters)"
                value={form.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

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
              disabled={isLoading}
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
            max-width: 480px;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .register-header {
            background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
            padding: 30px;
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
          }

          .input-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #26c6da;
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
            border-color: #26c6da;
            box-shadow: 0 0 0 2px rgba(38, 198, 218, 0.2);
          }

          .register-button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
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

          .register-button:hover:not(.loading) {
            background: linear-gradient(135deg, #00acc1 0%, #00838f 100%);
            box-shadow: 0 4px 12px rgba(0, 172, 193, 0.2);
          }

          .register-button.loading {
            background: #80deea;
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
          }
        `;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Register;
