// src/components/admin/components/TopNavigation.js
import React from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Logo from "../../Logo";

function TopNavigation({ user, sidebarOpen, setSidebarOpen, handleLogout }) {
  return (
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
          <div className="user-profile">
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
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
