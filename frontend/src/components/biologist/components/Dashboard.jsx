// import React, { useState, useEffect } from "react";
// import {
//   FiCamera,
//   FiDatabase,
//   FiFileText,
//   FiPlus,
//   FiDownload,
//   FiBarChart,
// } from "react-icons/fi";

// function Dashboard({ user, darkMode, onNavigate }) {
//   const [dashboardData, setDashboardData] = useState({
//     coral_distribution: [],
//     recent_stats: {
//       total_images: 0,
//       total_detections: 0,
//       avg_confidence: 0,
//       active_users: 0,
//     },
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `http://${process.env.REACT_APP_API_URL}/biologist/dashboard/stats`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setDashboardData(data);
//       } else {
//         throw new Error("Failed to fetch dashboard data");
//       }
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewAnalysis = () => {
//     if (onNavigate) {
//       onNavigate("Image Analysis");
//     }
//   };

//   const handleBrowseDatabase = () => {
//     if (onNavigate) {
//       onNavigate("Coral Database");
//     }
//   };

//   const handleExportData = () => {
//     // TODO: Implement data export functionality
//     alert("Data export functionality coming soon!");
//   };

//   const handleGenerateReport = () => {
//     // TODO: Implement report generation
//     alert("Report generation functionality coming soon!");
//   };

//   const handleViewAnalytics = () => {
//     // TODO: Implement analytics view
//     alert("Advanced analytics functionality coming soon!");
//   };

//   if (loading) {
//     return (
//       <div className="bio-dashboard">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bio-dashboard">
//       {/* Welcome Header */}
//       <div className="dashboard-header">
//         <div className="welcome-section">
//           <h2>Welcome back, {user?.firstname}!</h2>
//           <p>
//             Here's your research progress and recent coral analysis results.
//           </p>
//         </div>
//         <div className="header-actions">
//           <button className="action-btn secondary" onClick={handleExportData}>
//             <FiDownload size={18} />
//             <span>Export Data</span>
//           </button>
//           <button className="action-btn primary" onClick={handleNewAnalysis}>
//             <FiPlus size={18} />
//             <span>New Analysis</span>
//           </button>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-value">
//             {dashboardData.recent_stats.total_images}
//           </div>
//           <div className="stat-label">Images Analyzed</div>
//           <div className="stat-sublabel">Last 30 days</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-value">
//             {dashboardData.recent_stats.total_detections}
//           </div>
//           <div className="stat-label">Coral Detections</div>
//           <div className="stat-sublabel">Total identifications</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-value">
//             {dashboardData.recent_stats.avg_confidence.toFixed(1)}%
//           </div>
//           <div className="stat-label">Avg Confidence</div>
//           <div className="stat-sublabel">Analysis accuracy</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-value">
//             {dashboardData.recent_stats.active_users}
//           </div>
//           <div className="stat-label">Active Users</div>
//           <div className="stat-sublabel">Contributing researchers</div>
//         </div>
//       </div>

//       {/* Dashboard Grid */}
//       <div className="dashboard-grid">
//         {/* Coral Lifeform Distribution */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Coral Lifeform Distribution</h2>
//             <p>Most frequently identified coral lifeforms</p>
//           </div>
//           <div className="card-content">
//             {error ? (
//               <div className="error-message">
//                 <p>Error loading data: {error}</p>
//                 <button onClick={fetchDashboardData}>Retry</button>
//               </div>
//             ) : dashboardData.coral_distribution.length > 0 ? (
//               <div className="species-list">
//                 {dashboardData.coral_distribution.map((coral, index) => (
//                   <div key={coral.class_name} className="species-item">
//                     <div className="species-info">
//                       <span className="species-name">{coral.class_name}</span>
//                       <span className="species-count">
//                         {coral.percentage.toFixed(1)}% ({coral.detection_count}{" "}
//                         detections)
//                       </span>
//                     </div>
//                     <div className="species-bar">
//                       <div
//                         className="bar-fill"
//                         style={{
//                           width: `${coral.percentage}%`,
//                           backgroundColor: coral.color_hex || "#6B7280",
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-data-message">
//                 <p>No coral analysis data available yet.</p>
//                 <button
//                   onClick={handleNewAnalysis}
//                   className="start-analysis-btn"
//                 >
//                   <FiCamera size={16} />
//                   Start Your First Analysis
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="dashboard-card">
//           <div className="card-header">
//             <h2>Quick Actions</h2>
//             <p>Commonly used research tools</p>
//           </div>
//           <div className="card-content">
//             <div className="quick-actions-grid">
//               <button className="quick-action-card" onClick={handleNewAnalysis}>
//                 <div className="action-icon camera">
//                   <FiCamera size={24} />
//                 </div>
//                 <div className="action-content">
//                   <h4>Analyze Images</h4>
//                   <p>Upload and identify coral species</p>
//                 </div>
//               </button>

//               <button
//                 className="quick-action-card"
//                 onClick={handleBrowseDatabase}
//               >
//                 <div className="action-icon database">
//                   <FiDatabase size={24} />
//                 </div>
//                 <div className="action-content">
//                   <h4>Browse Database</h4>
//                   <p>Explore coral species information</p>
//                 </div>
//               </button>

//               <button
//                 className="quick-action-card"
//                 onClick={handleGenerateReport}
//               >
//                 <div className="action-icon report">
//                   <FiFileText size={24} />
//                 </div>
//                 <div className="action-content">
//                   <h4>Generate Report</h4>
//                   <p>Create research documentation</p>
//                 </div>
//               </button>

//               <button
//                 className="quick-action-card"
//                 onClick={handleViewAnalytics}
//               >
//                 <div className="action-icon charts">
//                   <FiBarChart size={24} />
//                 </div>
//                 <div className="action-content">
//                   <h4>View Analytics</h4>
//                   <p>Detailed analysis insights</p>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  FiCamera,
  FiDatabase,
  FiFileText,
  FiPlus,
  FiDownload,
  FiBarChart,
  FiX,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

import "../styles/biologistdashboardStyle.css";

function Dashboard({ user, darkMode, onNavigate }) {
  const [dashboardData, setDashboardData] = useState({
    coral_distribution: [],
    recent_stats: {
      total_images: 0,
      total_detections: 0,
      avg_confidence: 0,
      active_users: 0,
    },
    contributing_researchers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResearchersModal, setShowResearchersModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/biologist/dashboard/stats`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    if (onNavigate) {
      onNavigate("Image Analysis");
    }
  };

  const handleBrowseDatabase = () => {
    if (onNavigate) {
      onNavigate("Coral Database");
    }
  };

  const handleExportData = () => {
    alert("Data export functionality coming soon!");
  };

  const handleGenerateReport = () => {
    alert("Report generation functionality coming soon!");
  };

  const handleViewAnalytics = () => {
    alert("Advanced analytics functionality coming soon!");
  };

  const ResearchersModal = () => (
    <div
      className="modal-overlay"
      onClick={() => setShowResearchersModal(false)}
    >
      <div
        className="modal-content researchers-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Contributing Researchers</h3>
          <button
            className="modal-close"
            onClick={() => setShowResearchersModal(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="modal-body">
          {dashboardData.contributing_researchers.length > 0 ? (
            <div className="researchers-list">
              {dashboardData.contributing_researchers.map((researcher) => (
                <div key={researcher.id} className="researcher-card">
                  <div className="researcher-avatar">
                    {researcher.profile_image ? (
                      <img
                        src={`/profile_images/${researcher.profile_image}`}
                        alt={researcher.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="avatar-fallback"
                      style={{
                        display: researcher.profile_image ? "none" : "flex",
                      }}
                    >
                      {researcher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="researcher-info">
                    <div className="researcher-name">{researcher.name}</div>
                    <div className="researcher-username">
                      @{researcher.username}
                    </div>
                    <div className="researcher-institution">
                      {researcher.institution}
                    </div>
                  </div>
                  <div className="researcher-stats">
                    <div className="stat-item">
                      <FiCamera size={14} />
                      <span>{researcher.images_contributed} images</span>
                    </div>
                    <div className="stat-item">
                      <FiTrendingUp size={14} />
                      <span>
                        {researcher.detections_contributed} detections
                      </span>
                    </div>
                    <div className="stat-item">
                      <FiCalendar size={14} />
                      <span>
                        {researcher.contribution_percentage.toFixed(1)}%
                        contribution
                      </span>
                    </div>
                    {researcher.last_contribution && (
                      <div className="stat-item">
                        <span className="last-active">
                          Last:{" "}
                          {new Date(
                            researcher.last_contribution
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-researchers">
              <FiUsers size={48} />
              <p>No contributing researchers found in the last 30 days.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bio-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bio-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h2>Welcome back, {user?.firstname}!</h2>
          <p>
            Here's your personal research progress and coral analysis results.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="dashboard-action-btn secondary"
            onClick={handleExportData}
          >
            <FiDownload size={18} />
            <span>Export My Data</span>
          </button>
          <button
            className="dashboard-action-btn primary"
            onClick={handleNewAnalysis}
          >
            <FiPlus size={18} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-value">
            {dashboardData.recent_stats.total_images}
          </div>
          <div className="dashboard-stat-label">My Images Analyzed</div>
          <div className="dashboard-stat-sublabel">Last 30 days</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-value">
            {dashboardData.recent_stats.total_detections}
          </div>
          <div className="dashboard-stat-label">My Coral Detections</div>
          <div className="dashboard-stat-sublabel">Total identifications</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-value">
            {dashboardData.recent_stats.avg_confidence.toFixed(1)}%
          </div>
          <div className="dashboard-stat-label">My Avg Confidence</div>
          <div className="dashboard-stat-sublabel">Analysis accuracy</div>
        </div>
        <div
          className="dashboard-stat-card clickable"
          onClick={() => setShowResearchersModal(true)}
        >
          <div className="dashboard-stat-value">
            {dashboardData.recent_stats.active_users}
          </div>
          <div className="dashboard-stat-label">Contributing Researchers</div>
          <div className="dashboard-stat-sublabel">Click to view details</div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* My Coral Lifeform Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Coral Lifeform Distribution</h2>
            <p>
              Most frequently identified coral lifeforms across all analyses
            </p>
          </div>
          <div className="card-content">
            {error ? (
              <div className="error-message">
                <p>Error loading data: {error}</p>
                <button onClick={fetchDashboardData}>Retry</button>
              </div>
            ) : dashboardData.coral_distribution.length > 0 ? (
              <div className="species-list">
                {dashboardData.coral_distribution.map((coral, index) => (
                  <div key={coral.class_name} className="species-item">
                    <div className="species-info">
                      <span className="species-name">{coral.class_name}</span>
                      <span className="species-count">
                        {coral.percentage.toFixed(1)}% ({coral.detection_count}{" "}
                        detections)
                      </span>
                    </div>
                    <div className="species-bar">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${coral.percentage}%`,
                          backgroundColor: coral.color_hex || "#6B7280",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">
                <p>No coral analysis data available in the database yet.</p>
                <button
                  onClick={handleNewAnalysis}
                  className="start-analysis-btn"
                >
                  <FiCamera size={16} />
                  Contribute to the Database
                </button>
              </div>
            )}
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
              <button className="quick-action-card" onClick={handleNewAnalysis}>
                <div className="action-icon camera">
                  <FiCamera size={24} />
                </div>
                <div className="action-content">
                  <h4>Analyze Images</h4>
                  <p>Upload and identify coral species</p>
                </div>
              </button>

              <button
                className="quick-action-card"
                onClick={handleBrowseDatabase}
              >
                <div className="action-icon database">
                  <FiDatabase size={24} />
                </div>
                <div className="action-content">
                  <h4>Browse Database</h4>
                  <p>Explore coral species information</p>
                </div>
              </button>

              <button
                className="quick-action-card"
                onClick={handleGenerateReport}
              >
                <div className="action-icon report">
                  <FiFileText size={24} />
                </div>
                <div className="action-content">
                  <h4>Generate Report</h4>
                  <p>Create research documentation</p>
                </div>
              </button>

              <button
                className="quick-action-card"
                onClick={handleViewAnalytics}
              >
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

      {/* Researchers Modal */}
      {showResearchersModal && <ResearchersModal />}
    </div>
  );
}

export default Dashboard;
