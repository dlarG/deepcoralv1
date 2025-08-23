// src/components/guest/components/TopNavigation.js
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
            <span className="portal-tag">Guest</span>
          </div>
        </div>
        <div className="user-actions">
          {user && (
            <div className="user-profile">
              <div className="user-avatar">
                {user.firstname?.charAt(0) || user.username?.charAt(0)}
              </div>
              <div className="user-details">
                <span className="welcome-text">Welcome back,</span>
                <span className="username">
                  {user.firstname} {user.lastname}
                </span>
              </div>
            </div>
          )}
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
