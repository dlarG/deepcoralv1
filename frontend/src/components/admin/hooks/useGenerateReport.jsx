import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useGenerateReport() {
  const { fetchCsrfToken } = useAuth();
  const [activeReportType, setActiveReportType] = useState("users");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    role: "all",
    status: "all",
    activity_type: "all",
    category: "all",
    user_id: "all",
    page: 1,
    per_page: 50,
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset page when filters change
      ...(key !== "page" && { page: 1 }),
    }));
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

        case "activities":
          endpoint = "/admin/reports/activities";
          if (filters.activity_type !== "all")
            params.append("activity_type", filters.activity_type);
          if (filters.category !== "all")
            params.append("category", filters.category);
          if (filters.user_id !== "all")
            params.append("user_id", filters.user_id);
          params.append("page", filters.page);
          params.append("per_page", filters.per_page);
          break;

        default:
          throw new Error("Invalid report type");
      }

      console.log(
        "Making request to:",
        `${process.env.REACT_APP_API_URL}${endpoint}?${params}`
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}${endpoint}?${params}`,
        {
          withCredentials: true,
        }
      );

      console.log("Response received:", response.data);

      // Handle different response structures
      setReportData(
        response.data[activeReportType] ||
          response.data.users ||
          response.data.activities ||
          []
      );

      setSummary(response.data.summary);
      setPagination(response.data.pagination || null);
    } catch (error) {
      console.error("Failed to generate report:", error);
      console.error("Error details:", error.response?.data);
      alert(error.response?.data?.error || "Failed to generate report");
      setReportData([]);
      setSummary(null);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/reports/export/${activeReportType}`,
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

  // Reset filters when report type changes
  const setActiveReportTypeWithReset = (type) => {
    setActiveReportType(type);
    setReportData(null);
    setSummary(null);
    setPagination(null);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      // Keep common filters but reset specific ones
      role: "all",
      status: "all",
      activity_type: "all",
      category: "all",
      user_id: "all",
    }));
  };

  return {
    activeReportType,
    setActiveReportType: setActiveReportTypeWithReset,
    loading,
    reportData,
    summary,
    pagination,
    filters,
    updateFilter,
    generateReport,
    exportReport,
    printReport,
  };
}
