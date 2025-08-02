// src/components/admin/hooks/useGenerateReport.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useGenerateReport() {
  const { fetchCsrfToken } = useAuth();
  const [activeReportType, setActiveReportType] = useState("users");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    role: "all",
    status: "all",
    coral_type: "all",
    activity_type: "all",
    user_id: "all",
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let params = new URLSearchParams();

      // Add common filters
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);

      switch (activeReportType) {
        case "users":
          endpoint = "/admin/reports/users";
          if (filters.role !== "all") params.append("role", filters.role);
          if (filters.status !== "all") params.append("status", filters.status);
          break;

        case "corals":
          endpoint = "/admin/reports/corals";
          if (filters.coral_type !== "all")
            params.append("coral_type", filters.coral_type);
          break;

        case "activities":
          endpoint = "/admin/reports/activities";
          if (filters.activity_type !== "all")
            params.append("activity_type", filters.activity_type);
          if (filters.user_id !== "all")
            params.append("user_id", filters.user_id);
          break;

        default:
          throw new Error("Invalid report type");
      }

      const response = await axios.get(
        `http://localhost:5000${endpoint}?${params}`,
        {
          withCredentials: true,
        }
      );

      setReportData(
        response.data[activeReportType] ||
          response.data.users ||
          response.data.corals ||
          response.data.activities
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert(error.response?.data?.error || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await axios.post(
        `http://localhost:5000/admin/reports/export/${activeReportType}`,
        {
          format: format,
          filters: filters,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Failed to export report:", error);
      alert(error.response?.data?.error || "Failed to export report");
    }
  };

  const printReport = () => {
    window.print();
  };

  return {
    activeReportType,
    setActiveReportType,
    loading,
    reportData,
    summary,
    filters,
    updateFilter,
    generateReport,
    exportReport,
    printReport,
  };
}
