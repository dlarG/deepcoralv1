import React, { useState, useEffect } from "react";
import {
  FiX,
  FiUsers,
  FiImage,
  FiActivity,
  FiUserPlus,
  FiPieChart,
  FiBarChart,
  FiFile,
  FiClock,
  FiShield,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import "../styles/AnalyticsModal.css";

const AnalyticsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart },
    { id: "user-activity", label: "User Activity", icon: FiUsers },
    { id: "performance", label: "Performance", icon: FiActivity },
  ];

  const timeRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "365days", label: "Last Year" },
    { value: "all", label: "All Time" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchAnalyticsData();
    }
  }, [isOpen, activeTab, timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/analytics/${activeTab}?timeRange=${timeRange}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
      // Set empty data structure instead of mock data
      setAnalyticsData({
        imageUploadTrend: [],
        userGrowthTrend: [],
        systemHealthMetrics: [],
        engagement: {
          dailyActiveUsers: 0,
          avgSessionTime: "0m",
          retentionRate: 0,
          bounceRate: 0,
        },
        contentDistribution: [],
        qualityTrend: [],
        engagementPatterns: [],
        processingMetrics: {
          avgProcessingTime: 0,
          totalProcessed: 0,
          successRate: 0,
          errorRate: 0,
          queueLength: 0,
        },
        activityTimeline: [],
        registrationTrends: [],
        roleDistribution: [],
        userRetention: [],
        topUsers: [],
        processingTrends: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // PDF Export Function
  const exportAsPDF = async () => {
    if (exporting) return;

    setExporting(true);

    try {
      console.log(
        `Exporting ${activeTab} data as PDF with time range ${timeRange}`
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/analytics/export-pdf?tab=${activeTab}&timeRange=${timeRange}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "PDF export failed" }));
        throw new Error(
          errorData.error || `Export failed with status: ${response.status}`
        );
      }

      // Get the filename from response headers or create one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `analytics_${activeTab}_${timeRange}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create and download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show success message
      console.log(`Successfully exported PDF: ${filename}`);

      // Show success toast
      showSuccessToast("PDF report downloaded successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      alert(`PDF export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const showSuccessToast = (message) => {
    // Simple toast notification
    const toast = document.createElement("div");
    toast.className = "export-success-toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #dc2626;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1001;
      animation: slideInUp 0.3s ease;
      font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const getTabDescription = () => {
    const descriptions = {
      overview:
        "Complete platform metrics including uploads, users, and analysis quality",
      "user-activity":
        "User behavior patterns, registrations, and engagement statistics",
      performance:
        "System performance metrics, processing times, and error rates",
    };
    return descriptions[activeTab] || "";
  };

  const getTimeRangeLabel = () => {
    const range = timeRanges.find((r) => r.value === timeRange);
    return range ? range.label : timeRange;
  };

  if (!isOpen) return null;

  return (
    <div className="analytics-modal-overlay">
      <div className="analytics-modal">
        <div className="analytics-modal-header">
          <div className="modal-title">
            <FiBarChart size={24} />
            <div>
              <h2>Platform Analytics</h2>
              <span className="modal-subtitle">{getTabDescription()}</span>
            </div>
          </div>
          <div className="modal-controls">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-selector"
              title="Select time range"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* PDF Export Button */}
            <button
              className={`analytics-export-btn-pdf ${
                exporting ? "exporting" : ""
              }`}
              onClick={exportAsPDF}
              disabled={exporting}
              title={`Export ${activeTab.replace(
                "-",
                " "
              )} analytics as PDF (${getTimeRangeLabel()})`}
            >
              <FiFile size={18} />
              <span className="export-text">
                {exporting ? "Exporting..." : "Export PDF"}
              </span>
              {exporting && <span className="export-spinner"></span>}
            </button>

            <button className="analytics-close-btn" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="analytics-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="analytics-modal-content">
          <div className="analytics-content">
            {loading ? (
              <div className="loading-analytics">
                <div className="spinner"></div>
                <p>Loading analytics data...</p>
              </div>
            ) : error ? (
              <div className="error-analytics">
                <div className="error-icon">⚠️</div>
                <h3>Data Loading Issue</h3>
                <p>Some analytics data may be unavailable.</p>
                <p className="error-detail">{error}</p>
                <button className="retry-btn" onClick={fetchAnalyticsData}>
                  Retry Loading
                </button>
              </div>
            ) : null}

            {analyticsData && (
              <>
                {activeTab === "overview" && (
                  <OverviewAnalytics data={analyticsData} />
                )}
                {activeTab === "user-activity" && (
                  <UserActivityAnalytics data={analyticsData} />
                )}
                {activeTab === "performance" && (
                  <PerformanceAnalytics data={analyticsData} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Export Status Toast */}
        {exporting && (
          <div className="export-toast">
            <div className="export-toast-content">
              <div className="export-spinner"></div>
              <span>Generating PDF report...</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Overview Analytics with Separated Charts
const OverviewAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Provide default empty arrays if data is missing
  const imageUploadTrend = data.imageUploadTrend || [];
  const userGrowthTrend = data.userGrowthTrend || [];
  const contentDistribution = data.contentDistribution || [];
  const qualityTrend = data.qualityTrend || [];
  const engagementPatterns = data.engagementPatterns || [];

  return (
    <div className="overview-analytics">
      <div className="analytics-grid">
        {/* Image Upload Trends */}
        <div className="metric-card full-width">
          <div className="card-header">
            <h3>
              <FiImage /> Image Upload & Analysis Trends
            </h3>
            <div className="card-stats"></div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {imageUploadTrend.length > 0 ? (
              <ComposedChart data={imageUploadTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="uploads"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  fillOpacity={0.6}
                  name="Total Uploads"
                />
                <Line
                  type="monotone"
                  dataKey="analysisCompleted"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Analysis Completed"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            ) : (
              <div className="no-data-message">
                <FiImage size={48} />
                <p>No image upload data available</p>
                <small>Data will appear here once images are uploaded</small>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* User Growth Trends - Separate Chart */}
        <div className="metric-card full-width">
          <div className="card-header">
            <h3>
              <FiUsers /> User Registration & Approval Trends
            </h3>
            <div className="card-stats"></div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {userGrowthTrend.length > 0 ? (
              <ComposedChart data={userGrowthTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="newRegistrations"
                  fill="#8b5cf6"
                  name="New Registrations"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="approvals"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Approvals"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejections"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Rejections"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            ) : (
              <div className="no-data-message">
                <FiUsers size={48} />
                <p>No user registration data available</p>
                <small>
                  Data will appear here once users start registering
                </small>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Content Distribution */}
        <div className="metric-card">
          <div className="card-header">
            <h3>
              <FiPieChart /> Analysis Distribution
            </h3>
          </div>
          {contentDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name} ${(percentage || 0).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <FiPieChart size={48} />
              <p>No analysis data available</p>
            </div>
          )}
        </div>

        {/* Analysis Quality Trend */}
        <div className="metric-card">
          <div className="card-header">
            <h3>
              <FiShield /> Analysis Quality Trends
            </h3>
          </div>
          {qualityTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={qualityTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Avg Confidence (%)"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="highQuality"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="High Quality (%)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="needsReview"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Needs Review (%)"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <FiShield size={48} />
              <p>No quality data available</p>
            </div>
          )}
        </div>

        {/* User Activity Patterns */}
        <div className="metric-card">
          <div className="card-header">
            <h3>
              <FiClock /> Daily Activity Patterns
            </h3>
          </div>
          {engagementPatterns.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementPatterns}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="uploads"
                  fill="#3b82f6"
                  name="Uploads"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="logins"
                  fill="#10b981"
                  name="Logins"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <FiClock size={48} />
              <p>No activity data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced User Activity Analytics Component
const UserActivityAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Provide default empty arrays if data is missing
  const activityTimeline = data.activityTimeline || [];
  const registrationTrends = data.registrationTrends || [];
  const roleDistribution = data.roleDistribution || [];
  const userRetention = data.userRetention || [];
  const topUsers = data.topUsers || [];

  return (
    <div className="user-activity-analytics">
      <div className="analytics-grid">
        <div className="metric-card full-width">
          <div className="card-header">
            <h3>24-Hour User Activity Pattern</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {activityTimeline.length > 0 ? (
              <ComposedChart data={activityTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  fill="#8884d8"
                  stroke="#8884d8"
                  fillOpacity={0.6}
                  name="Active Users"
                />
                <Bar dataKey="uploads" fill="#82ca9d" name="Uploads" />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#ff7300"
                  strokeWidth={2}
                  name="Logins"
                  dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            ) : (
              <div className="no-data-message">
                <FiUsers size={48} />
                <p>No activity data available</p>
                <small>
                  Activity patterns will appear once users start using the
                  system
                </small>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <h3>Registration & Approval Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {registrationTrends.length > 0 ? (
              <LineChart data={registrationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="New Registrations"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="approvedUsers"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Approved"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pendingUsers"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Pending"
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="rejectedUsers"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Rejected"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <div className="no-data-message">
                <FiUserPlus size={48} />
                <p>No registration data available</p>
                <small>Registration trends will appear as users sign up</small>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <div className="card-header">
            <h3>User Role Distribution</h3>
          </div>
          {roleDistribution.length > 0 ? (
            <div className="role-distribution">
              {roleDistribution.map((role, index) => (
                <div key={role.name || index} className="role-item">
                  <div className="role-info">
                    <div
                      className="role-color"
                      style={{ backgroundColor: role.color || "#8884d8" }}
                    ></div>
                    <div className="role-details">
                      <div className="role-name">
                        {role.name || "Unknown Role"}
                      </div>
                      <div className="role-count">{role.count || 0} users</div>
                    </div>
                  </div>
                  <div className="role-growth">
                    <span
                      className={`growth ${
                        (role.growth || "").startsWith("+")
                          ? "positive"
                          : role.growth === "0%"
                          ? "neutral"
                          : "negative"
                      }`}
                    >
                      {role.growth || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-message">
              <FiUsers size={48} />
              <p>No role distribution data available</p>
              <small>
                Role distribution will appear once users are approved
              </small>
            </div>
          )}
        </div>

        {/* UPDATED: Top Contributing Users with 6 columns */}
        <div className="metric-card full-width">
          <div className="card-header">
            <h3>🏆 Top Contributing Users</h3>
            <small>Users with highest activity in the last 30 days</small>
          </div>
          {topUsers.length > 0 ? (
            <div className="top-users-table-enhanced">
              <div className="analytics-table-header">
                <div className="col-name">Name</div>
                <div className="col-username">Username</div>
                <div className="col-role">Role</div>
                <div className="col-total">Total Activities</div>
              </div>
              <div className="table-body">
                {topUsers.map((user, index) => (
                  <div key={user.name || index} className="table-row-enhanced">
                    <div className="col-name">
                      <div className="user-info-enhanced">
                        <span className="user-rank">#{index + 1}</span>
                        <div className="user-detail">
                          <span className="analytics-user-name">
                            {user.name || "Unknown User"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-username">
                      <span className="username-display">
                        {user.username || "N/A"}
                      </span>
                    </div>
                    <div className="col-role">
                      <span
                        className={`role-badge ${(
                          user.role || "user"
                        ).toLowerCase()}`}
                      >
                        {user.role || "User"}
                      </span>
                    </div>
                    <div className="col-total">
                      <div className="stat-value primary">
                        <span className="number">
                          {user.total_activities || 0}
                        </span>
                        <span className="label">total</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              <FiUsers size={48} />
              <p>No user activity data available</p>
              <small>Top users will appear once activity is tracked</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Performance Analytics Component
const PerformanceAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  const processingTrends = data.processingTrends || [];

  return (
    <div className="performance-analytics">
      <div className="analytics-grid">
        <div className="metric-card full-width">
          <div className="card-header">
            <h3>Processing Performance Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {processingTrends.length > 0 ? (
              <ComposedChart data={processingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="throughput"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  fillOpacity={0.6}
                  name="Throughput (images/day)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgProcessingTime"
                  stroke="#ff7300"
                  strokeWidth={3}
                  name="Avg Processing Time (s)"
                  dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Success Rate (%)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            ) : (
              <div className="no-data-message">
                <FiActivity size={48} />
                <p>No processing data available</p>
                <small>
                  Performance trends will appear as images are processed
                </small>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
