import React, { useState, useEffect } from "react";
import {
  FiX,
  FiTrendingUp,
  FiUsers,
  FiImage,
  FiMapPin,
  FiActivity,
  FiDatabase,
  FiCalendar,
  FiPieChart,
  FiBarChart,
  FiDownload,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
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
} from "recharts";
import "../styles/AnalyticsModal.css";

const AnalyticsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart },
    { id: "user-activity", label: "User Activity", icon: FiUsers },
    { id: "geographic", label: "Geographic Data", icon: FiMapPin },
    { id: "performance", label: "System Performance", icon: FiActivity },
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
      // Fix the API endpoint path - add the correct base path
      const response = await fetch(
        `http://localhost:5000/admin/analytics/${activeTab}?timeRange=${timeRange}`,
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
      setAnalyticsData(getMockData(activeTab));
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format = "csv") => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/analytics/export?tab=${activeTab}&timeRange=${timeRange}&format=${format}`,
        {
          credentials: "include",
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_${activeTab}_${timeRange}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const getMockData = (tab) => {
    const mockData = {
      overview: {
        growthTrend: [
          { date: "2024-01-01", users: 120, images: 450 },
          { date: "2024-01-02", users: 135, images: 520 },
          { date: "2024-01-03", users: 150, images: 600 },
          { date: "2024-01-04", users: 180, images: 750 },
          { date: "2024-01-05", users: 200, images: 850 },
        ],
        engagement: {
          dailyActiveUsers: 1250,
          avgSessionTime: "12m 34s",
          retentionRate: 78,
        },
        contentDistribution: [
          { name: "Coral Images", value: 45, color: "#8884d8" },
          { name: "Analysis Reports", value: 30, color: "#82ca9d" },
          { name: "User Content", value: 25, color: "#ffc658" },
        ],
      },
      "user-activity": {
        activityTimeline: [
          { hour: "00:00", activeUsers: 45 },
          { hour: "06:00", activeUsers: 120 },
          { hour: "12:00", activeUsers: 350 },
          { hour: "18:00", activeUsers: 280 },
          { hour: "23:00", activeUsers: 85 },
        ],
        registrationTrends: [
          { date: "2024-01-01", newUsers: 15, approvedUsers: 12 },
          { date: "2024-01-02", newUsers: 22, approvedUsers: 18 },
          { date: "2024-01-03", newUsers: 18, approvedUsers: 16 },
        ],
        roleDistribution: [
          { name: "Researchers", count: 450, color: "#8884d8" },
          { name: "Students", count: 320, color: "#82ca9d" },
          { name: "Admins", count: 25, color: "#ffc658" },
        ],
      },
      geographic: {
        regionData: [
          { region: "Great Barrier Reef", imageCount: 1250 },
          { region: "Caribbean", imageCount: 850 },
          { region: "Red Sea", imageCount: 650 },
          { region: "Pacific Northwest", imageCount: 420 },
        ],
        siteMetrics: {
          totalSites: 156,
          activeSites: 89,
          avgImagesPerSite: 45,
        },
        topProvinces: [
          { name: "Queensland", count: 890 },
          { name: "Florida", count: 670 },
          { name: "Hawaii", count: 450 },
        ],
      },
      performance: {
        processingTrends: [
          { date: "2024-01-01", avgProcessingTime: 2.5, successRate: 95 },
          { date: "2024-01-02", avgProcessingTime: 2.3, successRate: 96 },
          { date: "2024-01-03", avgProcessingTime: 2.7, successRate: 94 },
        ],
        systemMetrics: {
          cpuUsage: 65,
          memoryUsage: 72,
          storageUsed: 450,
        },
        errorDistribution: [
          { name: "Processing Errors", count: 15, color: "#ff6b6b" },
          { name: "Network Issues", count: 8, color: "#4ecdc4" },
          { name: "User Errors", count: 12, color: "#45b7d1" },
        ],
      },
    };

    return mockData[tab] || mockData.overview;
  };

  if (!isOpen) return null;

  return (
    <div className="analytics-modal-overlay">
      <div className="analytics-modal">
        <div className="analytics-modal-header">
          <div className="modal-title">
            <FiBarChart size={24} />
            <h2>Platform Analytics</h2>
          </div>
          <div className="modal-controls">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-selector"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button className="close-btn" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>
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
                <h3>Using Mock Data</h3>
                <p>
                  Backend analytics endpoint not available. Showing sample data.
                </p>
                <p className="error-detail">{error}</p>
              </div>
            ) : null}

            {analyticsData && (
              <>
                {activeTab === "overview" && (
                  <OverviewAnalytics data={analyticsData} />
                )}
                {activeTab === "coral-trends" && (
                  <CoralTrendsAnalytics data={analyticsData} />
                )}
                {activeTab === "user-activity" && (
                  <UserActivityAnalytics data={analyticsData} />
                )}
                {activeTab === "geographic" && (
                  <GeographicAnalytics data={analyticsData} />
                )}
                {activeTab === "performance" && (
                  <PerformanceAnalytics data={analyticsData} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep all the existing component definitions (OverviewAnalytics, CoralTrendsAnalytics, etc.)
// ... (the rest of the components remain the same)

// Overview Analytics Component
const OverviewAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="overview-analytics">
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>Platform Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.growthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="New Users"
              />
              <Area
                type="monotone"
                dataKey="images"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Images Uploaded"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Coral Trends Analytics Component
const CoralTrendsAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="coral-analytics">
      <div className="analytics-grid">
        <div className="full-width-card">
          <h3>Coral Coverage Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.coverageTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="hardCoral"
                stroke="#ff7300"
                name="Hard Coral Coverage (%)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="softCoral"
                stroke="#387908"
                name="Soft Coral Coverage (%)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="algae"
                stroke="#8884d8"
                name="Algae Coverage (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Species Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.speciesDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="species"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Analysis Quality Metrics</h3>
          <div className="quality-metrics">
            <div className="metric">
              <span className="metric-value">
                {data.qualityMetrics.avgConfidence}%
              </span>
              <span className="metric-label">Avg AI Confidence</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.qualityMetrics.highQualityAnalyses}
              </span>
              <span className="metric-label">High Quality Analyses</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.qualityMetrics.manualReviews}
              </span>
              <span className="metric-label">Manual Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Activity Analytics Component
const UserActivityAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="user-activity-analytics">
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>User Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke="#8884d8"
                fill="#8884d8"
                name="Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>User Registration Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.registrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#82ca9d"
                strokeWidth={2}
                name="New Registrations"
              />
              <Line
                type="monotone"
                dataKey="approvedUsers"
                stroke="#8884d8"
                strokeWidth={2}
                name="Approved Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.roleDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Geographic Analytics Component
const GeographicAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="geographic-analytics">
      <div className="analytics-grid">
        <div className="full-width-card">
          <h3>Data Collection by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.regionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={150} />
              <Tooltip />
              <Bar
                dataKey="imageCount"
                fill="#8884d8"
                name="Images Collected"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Site Coverage</h3>
          <div className="site-metrics">
            <div className="metric">
              <span className="metric-value">
                {data.siteMetrics.totalSites}
              </span>
              <span className="metric-label">Total Survey Sites</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.siteMetrics.activeSites}
              </span>
              <span className="metric-label">Active Sites (30 days)</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.siteMetrics.avgImagesPerSite}
              </span>
              <span className="metric-label">Avg Images per Site</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Top Provinces by Activity</h3>
          <div className="top-provinces">
            {data.topProvinces.map((province, index) => (
              <div key={province.name} className="province-item">
                <span className="rank">#{index + 1}</span>
                <span className="province-name">{province.name}</span>
                <span className="province-count">{province.count} images</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Analytics Component
const PerformanceAnalytics = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="performance-analytics">
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>Processing Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.processingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgProcessingTime"
                stroke="#ff7300"
                name="Avg Processing Time (s)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="#82ca9d"
                name="Success Rate (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>System Resources</h3>
          <div className="resource-metrics">
            <div className="metric">
              <span className="metric-value">
                {data.systemMetrics.cpuUsage}%
              </span>
              <span className="metric-label">CPU Usage</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.systemMetrics.memoryUsage}%
              </span>
              <span className="metric-label">Memory Usage</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {data.systemMetrics.storageUsed} GB
              </span>
              <span className="metric-label">Storage Used</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Error Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.errorDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.errorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
