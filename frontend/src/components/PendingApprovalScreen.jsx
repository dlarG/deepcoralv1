import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiMail,
  FiArrowRight,
  FiMaybe,
  FiHelpCircle,
} from "react-icons/fi";
import "../styles/pending-approval.css";

function PendingApprovalScreen({ userData }) {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    document.title = "Pending Approval - DeepCoral";

    // Generate random bubbles
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 40 + 10,
          left: Math.random() * 100,
          animationDuration: Math.random() * 10 + 8,
          animationDelay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="pending-approval-container">
      {/* Animated Ocean Background */}
      <div className="ocean-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>

        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
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
      </div>

      {/* Main Content */}
      <div className="pending-card">
        <div className="pending-header">
          <div className="pending-icon">
            <FiClock size={64} />
          </div>
          <h1>Application Under Review</h1>
          <p className="pending-subtitle">
            Your registration has been submitted successfully!
          </p>
        </div>

        <div className="pending-body">
          {/* User Info Summary */}
          <div className="user-summary">
            <h2>Welcome, {userData?.firstname}! 👋</h2>
            <div className="summary-details">
              <div className="detail-item">
                <span className="detail-label">Username:</span>
                <span className="detail-value">@{userData?.username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userData?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value pending">⏳ Pending Approval</span>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="pending-message">
            <div className="message-icon">
              <FiMail size={32} />
            </div>
            <h3>What Happens Next?</h3>
            <p>
              Your account is now under review by our administrator team. This process typically takes <strong>up to 24 hours</strong>, but may be completed sooner.
            </p>
            <p>
              Once approved, you'll receive a confirmation email at <strong>{userData?.email}</strong> with instructions to log in and start using the platform.
            </p>
          </div>

          {/* Timeline / Steps */}
          <div className="approval-timeline">
            <div className="timeline-item completed">
              <div className="timeline-dot">✓</div>
              <div className="timeline-content">
                <h4>Registration Submitted</h4>
                <p>Your account has been created successfully</p>
              </div>
            </div>

            <div className="timeline-item active">
              <div className="timeline-dot">
                <div className="spinner-dot"></div>
              </div>
              <div className="timeline-content">
                <h4>Admin Review</h4>
                <p>Our team is reviewing your application</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">2</div>
              <div className="timeline-content">
                <h4>Account Activated</h4>
                <p>You'll receive an approval email with login instructions</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="important-notes">
            <div className="note-box note-info">
              <FiHelpCircle size={20} />
              <div>
                <h4>💡 Pro Tip</h4>
                <p>Check your email (including spam/promotions folder) for the approval notification.</p>
              </div>
            </div>

            <div className="note-box note-important">
              <FiMaybe size={20} />
              <div>
                <h4>⏱️ Beyond 24 Hours?</h4>
                <p>
                  If you haven't received an approval email after 24 hours, please contact us at{" "}
                  <a href="mailto:support@deepcoral.site">support@deepcoral.site</a>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pending-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
            >
              Go to Login Page
              <FiArrowRight size={18} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>

          {/* Footer Message */}
          <div className="pending-footer">
            <p>Thank you for joining DeepCoral! We're excited to have you on our mission to protect coral reefs. 🪸</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovalScreen;
