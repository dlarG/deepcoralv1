import React, { useState } from "react";
import {
  FiCamera,
  FiDatabase,
  FiFileText,
  FiTrendingUp,
  FiEye,
  FiPlus,
  FiDownload,
  FiBarChart,
} from "react-icons/fi";

function Dashboard({ user, darkMode }) {
  const [stats, setStats] = useState({
    totalImages: 1247,
    analysesCompleted: 89,
    reportsGenerated: 23,
    accuracyRate: 94.7,
  });

  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      species: "Acropora cervicornis",
      confidence: 96.5,
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      species: "Montastraea cavernosa",
      confidence: 89.2,
      timestamp: "4 hours ago",
      status: "completed",
    },
    {
      id: 3,
      species: "Porites astreoides",
      confidence: 92.8,
      timestamp: "6 hours ago",
      status: "completed",
    },
  ]);

  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: "Mon", analyses: 12, accuracy: 94.2 },
    { day: "Tue", analyses: 18, accuracy: 95.1 },
    { day: "Wed", analyses: 15, accuracy: 93.8 },
    { day: "Thu", analyses: 22, accuracy: 96.3 },
    { day: "Fri", analyses: 19, accuracy: 94.9 },
    { day: "Sat", analyses: 8, accuracy: 92.5 },
    { day: "Sun", analyses: 5, accuracy: 91.7 },
  ]);

  return (
    <div className="bio-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstname}!</h1>
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

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FiCamera size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalImages.toLocaleString()}</h3>
            <p>Images Analyzed</p>
            <span className="stat-change positive">+12% this week</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FiEye size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.analysesCompleted}</h3>
            <p>Analyses Completed</p>
            <span className="stat-change positive">+8% this week</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FiFileText size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.reportsGenerated}</h3>
            <p>Reports Generated</p>
            <span className="stat-change positive">+15% this week</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FiTrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.accuracyRate}%</h3>
            <p>Average Accuracy</p>
            <span className="stat-change positive">+2.1% this week</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Analyses */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Analyses</h2>
            <p>Your latest coral species identifications</p>
          </div>
          <div className="card-content">
            <div className="analyses-list">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="analysis-item">
                  <div className="analysis-info">
                    <div className="species-name">{analysis.species}</div>
                    <div className="analysis-meta">
                      <span className="confidence">
                        {analysis.confidence}% confidence
                      </span>
                      <span className="timestamp">{analysis.timestamp}</span>
                    </div>
                  </div>
                  <div className="analysis-status">
                    <span className={`status-badge ${analysis.status}`}>
                      {analysis.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <button className="view-all-analyses">View All Analyses</button>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Weekly Progress</h2>
            <p>Analysis count and accuracy trends</p>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color analyses"></div>
                  <span>Analyses</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color accuracy"></div>
                  <span>Accuracy %</span>
                </div>
              </div>
              <div className="progress-chart">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="chart-day">
                    <div className="chart-bars">
                      <div
                        className="bar analyses"
                        style={{ height: `${(day.analyses / 25) * 100}%` }}
                        title={`${day.analyses} analyses`}
                      ></div>
                      <div
                        className="bar accuracy"
                        style={{ height: `${day.accuracy}%` }}
                        title={`${day.accuracy}% accuracy`}
                      ></div>
                    </div>
                    <div className="day-label">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
