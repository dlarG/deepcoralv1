import { useState, useEffect } from "react";
import axios from "axios";
// import { useAuth } from "../../../context/AuthContext";

export default function useDashboardData() {
  // const { logout } = useAuth();

  const [stats, setStats] = useState({
    approved_users: 0,
    total_images: 0,
    coral_species: 0,
    analysis_sessions: 0,
    recent_activities: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = "http://localhost:5000";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const promises = [
        fetchStats(),
        fetchRecentUsers(),
        fetchRecentActivities(),
        fetchChartData(),
      ];

      const [statsData, usersData, activitiesData, chartDataResult] =
        await Promise.allSettled(promises);

      // Process results
      if (statsData.status === "fulfilled") {
        setStats(statsData.value);
      }

      if (usersData.status === "fulfilled") {
        setRecentUsers(usersData.value);
      }

      if (activitiesData.status === "fulfilled") {
        setRecentActivities(activitiesData.value);
      }

      if (chartDataResult.status === "fulfilled") {
        setChartData(chartDataResult.value);
      }
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/stats`,
        {
          withCredentials: true,
        }
      );
      return (
        response.data.stats || {
          approved_users: 0,
          total_images: 0,
          coral_species: 0,
          analysis_sessions: 0,
          recent_activities: 0,
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/recent-users`,
        {
          withCredentials: true,
        }
      );
      return response.data.recent_users || [];
    } catch (error) {
      console.error("❌ Error fetching recent users:", error);
      throw error;
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/recent-activities`,
        {
          withCredentials: true,
        }
      );
      return response.data.recent_activities || [];
    } catch (error) {
      throw error;
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/chart-data`,
        {
          withCredentials: true,
        }
      );

      return response.data.chart_data || null;
    } catch (error) {
      throw error;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Utility functions
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";

    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      login: "🔑",
      logout: "🚪",
      registration: "👤",

      user_created: "➕",
      user_updated: "✏️",
      user_deleted: "🗑️",
      user_approved: "✅",
      user_rejected: "❌",

      coral_info_created: "🪸",
      coral_info_updated: "✏️",
      coral_info_deleted: "🗑️",

      image_upload: "📸",
      analysis_completed: "✅",

      model_upload: "🤖",
      model_deleted: "🗑️",
      system_settings_updated: "⚙️",

      report_generated: "📄",

      default: "📋",

      upload: "📁",
      analysis: "🔬",
      create: "➕",
      update: "✏️",
      delete: "🗑️",
      approval: "✅",
      rejection: "❌",
    };
    return iconMap[type] || "📋";
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  const getCategoryColor = (category) => {
    const colors = {
      authentication: "#3b82f6",
      user_management: "#10b981",
      coral_data: "#f59e0b",
      image_analysis: "#8b5cf6",
      system_admin: "#ef4444",
      reports: "#06b6d4",
    };

    return colors[category] || "#6b7280";
  };

  return {
    // Data
    stats,
    recentUsers,
    recentActivities,
    chartData,
    loading,
    error,

    // Functions
    refreshDashboard,
    formatTimeAgo,
    getActivityIcon,

    // Individual fetch functions (for manual refresh)
    fetchStats,
    fetchRecentUsers,
    fetchRecentActivities,
    fetchChartData,

    getCategoryColor,
  };
}
