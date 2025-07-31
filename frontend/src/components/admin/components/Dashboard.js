import React from "react";
import { FiUsers, FiImage, FiFileText, FiDatabase } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="content-section">
      <h2 className="content-title">Admin Dashboard</h2>
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
