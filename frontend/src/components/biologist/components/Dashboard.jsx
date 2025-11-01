import React from "react";
import {
  FiCamera,
  FiDatabase,
  FiFileText,
  FiPlus,
  FiDownload,
  FiBarChart,
} from "react-icons/fi";

function Dashboard({ user, darkMode }) {
  return (
    <div className="bio-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h2>Welcome back, {user?.firstname}!</h2>
          <p>
            Here's your research progress and recent coral analysis results.
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary">
            <FiDownload size={18} />
            <span>Export Data</span>
          </button>
          <button className="action-btn primary">
            <FiPlus size={18} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Species Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Species Distribution</h2>
            <p>Most frequently identified coral species</p>
          </div>
          <div className="card-content">
            <div className="species-list">
              <div className="species-item">
                <div className="species-info">
                  <span className="species-name">Acropora cervicornis</span>
                  <span className="species-count">34% (247 samples)</span>
                </div>
                <div className="species-bar">
                  <div className="bar-fill" style={{ width: "34%" }}></div>
                </div>
              </div>
              <div className="species-item">
                <div className="species-info">
                  <span className="species-name">Montastraea cavernosa</span>
                  <span className="species-count">28% (203 samples)</span>
                </div>
                <div className="species-bar">
                  <div className="bar-fill" style={{ width: "28%" }}></div>
                </div>
              </div>
              <div className="species-item">
                <div className="species-info">
                  <span className="species-name">Porites astreoides</span>
                  <span className="species-count">22% (159 samples)</span>
                </div>
                <div className="species-bar">
                  <div className="bar-fill" style={{ width: "22%" }}></div>
                </div>
              </div>
              <div className="species-item">
                <div className="species-info">
                  <span className="species-name">Other Species</span>
                  <span className="species-count">16% (116 samples)</span>
                </div>
                <div className="species-bar">
                  <div className="bar-fill" style={{ width: "16%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
            <p>Commonly used research tools</p>
          </div>
          <div className="card-content">
            <div className="quick-actions-grid">
              <button className="quick-action-card">
                <div className="action-icon camera">
                  <FiCamera size={24} />
                </div>
                <div className="action-content">
                  <h4>Analyze Images</h4>
                  <p>Upload and identify coral species</p>
                </div>
              </button>

              <button className="quick-action-card">
                <div className="action-icon database">
                  <FiDatabase size={24} />
                </div>
                <div className="action-content">
                  <h4>Browse Database</h4>
                  <p>Explore coral species information</p>
                </div>
              </button>

              <button className="quick-action-card">
                <div className="action-icon report">
                  <FiFileText size={24} />
                </div>
                <div className="action-content">
                  <h4>Generate Report</h4>
                  <p>Create research documentation</p>
                </div>
              </button>

              <button className="quick-action-card">
                <div className="action-icon charts">
                  <FiBarChart size={24} />
                </div>
                <div className="action-content">
                  <h4>View Analytics</h4>
                  <p>Detailed analysis insights</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
