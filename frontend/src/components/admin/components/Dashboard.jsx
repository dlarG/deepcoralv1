import React from "react";
import { FiUsers, FiImage, FiFileText, FiDatabase } from "react-icons/fi";
import "../styles/dashboardStyle.css";

const Dashboard = ({ user }) => {
  return (
    <div className="content-section">
      <div className="user-greetings">
        <h2 className="report-title">
          Welcome back, {user.firstname} {user.lastname}
        </h2>
        <p>Here's a quick overview of the platform's status.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FiUsers size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>24</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon images">
            <FiImage size={24} />
          </div>
          <div className="stat-info">
            <h3>Coral Images</h3>
            <p>156</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon reports">
            <FiFileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Reports Generated</h3>
            <p>42</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon species">
            <FiDatabase size={24} />
          </div>
          <div className="stat-info">
            <h3>Coral Species</h3>
            <p>18</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
