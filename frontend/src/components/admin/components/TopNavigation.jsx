import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiSettings,
  FiFileText,
  FiChevronDown,
} from "react-icons/fi";
import Logo from "../../Logo";

function TopNavigation({ user, sidebarOpen, setSidebarOpen, handleLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (action) => {
    setDropdownOpen(false);

    switch (action) {
      case "profile":
        console.log("Navigate to profile");
        break;
      case "settings":
        console.log("Navigate to settings");
        break;
      case "reports":
        console.log("Navigate to reports");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <style jsx>{`
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          height: 90px;
          max-width: 100%;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-toggle:hover {
          background: #f8fafc;
          color: #334155;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .portal-tag {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .user-actions {
          display: flex;
          align-items: center;
          position: relative;
        }

        .user-profile-dropdown {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          max-width: 280px;
        }

        .profile-trigger:hover {
          background: #f8fafc;
        }

        .profile-trigger.active {
          background: #f1f5f9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          flex: 1;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .user-role {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .dropdown-arrow {
          color: #94a3b8;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .dropdown-arrow.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          z-index: 1000;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          pointer-events: none;
        }

        .dropdown-menu.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          margin: -0.75rem -0.75rem 0.5rem -0.75rem;
        }

        .dropdown-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .dropdown-user-email {
          font-size: 0.75rem;
          color: #64748b;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: #475569;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #334155;
        }

        .dropdown-item.danger {
          color: #dc2626;
        }

        .dropdown-item.danger:hover {
          background: #fef2f2;
          color: #991b1b;
        }

        .dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0.5rem 0;
        }

        .dropdown-item-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .user-info {
            display: none;
          }

          .profile-trigger {
            padding: 0.5rem;
          }

          .dropdown-menu {
            right: -1rem;
            min-width: 200px;
          }
        }

        @media (max-width: 480px) {
          .portal-tag {
            display: none;
          }
        }
      `}</style>

      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="logo-container">
              <Logo variant="navbar" type="image" theme="light" />
              <span className="portal-tag">Admin</span>
            </div>
          </div>

          <div className="user-actions">
            <div className="user-profile-dropdown" ref={dropdownRef}>
              <button
                className={`profile-trigger ${dropdownOpen ? "active" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.profile_image ? (
                    <img
                      src={`/profile_uploads/${user.profile_image}`}
                      alt={`${user.firstname} ${user.lastname}`}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="avatar-text"
                    style={{ display: user.profile_image ? "none" : "flex" }}
                  >
                    {user.firstname?.charAt(0)}
                    {user.lastname?.charAt(0)}
                  </div>
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="user-role">Administrator</span>
                </div>
                <FiChevronDown
                  className={`dropdown-arrow ${dropdownOpen ? "rotated" : ""}`}
                  size={16}
                />
              </button>

              <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("profile")}
                >
                  <FiUser className="dropdown-item-icon" />
                  My Profile
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("settings")}
                >
                  <FiSettings className="dropdown-item-icon" />
                  Settings
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("reports")}
                >
                  <FiFileText className="dropdown-item-icon" />
                  Reports
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item danger"
                  onClick={() => handleDropdownItemClick("logout")}
                >
                  <FiLogOut className="dropdown-item-icon" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default TopNavigation;
