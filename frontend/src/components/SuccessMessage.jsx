import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiAlertCircle,
  FiTrash2,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message = "Operation completed successfully",
  type = "success", // 'success', 'error', 'warning', 'info'
  autoClose = true,
  autoCloseDelay = 3000,
  customActions = false,
  onConfirm = null,
  onCancel = null,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <FiCheck size={48} />,
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          particle: "#10b981",
        };
      case "error":
        return {
          icon: <FiX size={48} />,
          gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          particle: "#ef4444",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle size={48} />,
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          particle: "#f59e0b",
        };
      case "info":
        return {
          icon: <FiAlertCircle size={48} />,
          gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          particle: "#0ea5e9",
        };
      default:
        return {
          icon: <FiCheck size={48} />,
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          particle: "#10b981",
        };
    }
  };

  const { icon, gradient, particle } = getIconAndColors();

  // Fixed handleClose function
  const handleClose = React.useCallback(() => {
    console.log("handleClose called");
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  }, [onClose]);

  // Handle confirm action
  const handleConfirm = () => {
    console.log("handleConfirm called");
    if (onConfirm) {
      onConfirm();
    } else {
      handleClose();
    }
  };

  // Fixed handleCancel function - this was the main issue
  const handleCancel = () => {
    console.log("handleCancel called");
    // First trigger the onCancel callback if provided
    if (onCancel) {
      onCancel();
    }
    // Then close the modal using the same logic as handleClose
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  // Get dynamic button text and icons based on modal type and title
  const getButtonConfig = () => {
    if (title.includes("Approval") || title.includes("approve")) {
      return {
        confirmIcon: <FiUserCheck size={16} />,
        confirmText: "Yes, Approve",
        cancelIcon: <FiX size={16} />,
        cancelText: "Cancel",
      };
    } else if (title.includes("Rejection") || title.includes("reject")) {
      return {
        confirmIcon: <FiUserX size={16} />,
        confirmText: "Yes, Reject",
        cancelIcon: <FiX size={16} />,
        cancelText: "Cancel",
      };
    } else if (title.includes("Delete") || title.includes("delete")) {
      return {
        confirmIcon: <FiTrash2 size={16} />,
        confirmText: "Yes, Delete",
        cancelIcon: <FiX size={16} />,
        cancelText: "Cancel",
      };
    } else {
      // Default based on type
      return {
        confirmIcon:
          type === "warning" ? (
            <FiAlertTriangle size={16} />
          ) : (
            <FiCheck size={16} />
          ),
        confirmText: type === "warning" ? "Confirm" : "Yes, Continue",
        cancelIcon: <FiX size={16} />,
        cancelText: "Cancel",
      };
    }
  };

  const buttonConfig = getButtonConfig();

  // Fixed useEffect to properly handle modal state
  useEffect(() => {
    console.log("Modal isOpen changed to:", isOpen);
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);

      // Only auto-close for success messages and when customActions is false
      if (autoClose && type === "success" && !customActions) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // When isOpen becomes false, start closing animation
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen, autoClose, autoCloseDelay, handleClose, type, customActions]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .success-modal-overlay.animate {
          opacity: 1;
        }

        .success-modal {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 450px;
          width: 90%;
          position: relative;
          transform: translateY(50px) scale(0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
        }

        .success-modal.animate {
          transform: translateY(0) scale(1);
        }

        .success-modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #f8fafc;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.3s ease;
        }

        .success-modal-close:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        .success-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .success-icon-bg {
          width: 120px;
          height: 120px;
          background: ${gradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          animation: successPulse 0.6s ease-out;
        }

        .success-icon-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out 0.2s forwards;
        }

        .success-check-icon {
          color: white;
          z-index: 2;
          transform: scale(0);
          animation: checkScale 0.4s ease-out 0.4s forwards;
        }

        .success-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: ${particle};
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 1.5s ease-out forwards;
        }

        .particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0.6s; }
        .particle:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.7s; }
        .particle:nth-child(3) { bottom: 25%; left: 25%; animation-delay: 0.8s; }
        .particle:nth-child(4) { bottom: 20%; right: 20%; animation-delay: 0.9s; }
        .particle:nth-child(5) { top: 10%; left: 50%; animation-delay: 1s; }
        .particle:nth-child(6) { bottom: 10%; left: 50%; animation-delay: 1.1s; }

        @keyframes successPulse {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }

        @keyframes checkScale {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes particleFloat {
          0% { opacity: 1; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0); }
        }

        .success-modal-content {
          text-align: center;
        }

        .success-modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          background: ${gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .success-modal-message {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 350px;
          margin-left: auto;
          margin-right: auto;
          white-space: pre-line;
        }

        .success-modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .success-modal-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          min-width: 120px;
          justify-content: center;
        }

        .success-modal-button.primary {
          background: ${gradient};
          color: white;
          box-shadow: 0 4px 15px ${particle}40;
        }

        .success-modal-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${particle}60;
        }

        .success-modal-button.danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .success-modal-button.danger:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
        }

        .success-modal-button.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .success-modal-button.approve:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
        }

        .success-modal-button.reject {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .success-modal-button.reject:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6);
        }

        .success-modal-button.secondary {
          background: #f8fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .success-modal-button.secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: ${gradient};
          border-radius: 0 0 24px 24px;
          transform-origin: left;
          animation: progressShrink linear forwards;
        }

        @keyframes progressShrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .success-modal {
            padding: 2rem;
            max-width: 350px;
          }

          .success-icon-bg {
            width: 100px;
            height: 100px;
          }

          .success-modal-title {
            font-size: 1.5rem;
          }

          .success-modal-message {
            font-size: 1rem;
          }

          .success-modal-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className={`success-modal-overlay ${isAnimating ? "animate" : ""}`}
        onClick={!customActions ? handleClose : undefined}
      >
        <div
          className={`success-modal ${isAnimating ? "animate" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {!customActions && (
            <button
              className="success-modal-close"
              onClick={handleClose}
              title="Close"
            >
              <FiX size={20} />
            </button>
          )}

          {autoClose && type === "success" && !customActions && (
            <div
              className="progress-bar"
              style={{
                animationDuration: `${autoCloseDelay}ms`,
                animationDelay: "0.5s",
              }}
            />
          )}

          <div className="success-icon-container">
            <div className="success-icon-bg">
              <div className="success-check-icon">{icon}</div>
            </div>
            <div className="success-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>

          <div className="success-modal-content">
            <h2 className="success-modal-title">{title}</h2>
            <p className="success-modal-message">{message}</p>

            <div className="success-modal-actions">
              {customActions ? (
                <>
                  <button
                    className={`success-modal-button ${
                      title.includes("Approval") || title.includes("approve")
                        ? "approve"
                        : title.includes("Rejection") ||
                          title.includes("reject")
                        ? "reject"
                        : "danger"
                    }`}
                    onClick={handleConfirm}
                  >
                    {buttonConfig.confirmIcon}
                    {buttonConfig.confirmText}
                  </button>
                  <button
                    className="success-modal-button secondary"
                    onClick={handleCancel}
                  >
                    {buttonConfig.cancelIcon}
                    {buttonConfig.cancelText}
                  </button>
                </>
              ) : (
                <button
                  className="success-modal-button primary"
                  onClick={handleClose}
                >
                  {type === "error" ? (
                    <FiX size={16} />
                  ) : type === "warning" ? (
                    <FiAlertTriangle size={16} />
                  ) : (
                    <FiCheck size={16} />
                  )}
                  {type === "error" ? "Understood" : "Got it!"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;
