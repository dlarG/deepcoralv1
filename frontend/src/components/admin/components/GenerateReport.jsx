import React, { useEffect } from "react";
import {
  FiDownload,
  FiUsers,
  FiActivity,
  FiFilter,
  FiFileText,
  FiBarChart,
  FiChevronLeft,
  FiChevronRight,
  FiFile,
} from "react-icons/fi";
import useGenerateReport from "../hooks/useGenerateReport";

function GenerateReport() {
  const {
    activeReportType,
    setActiveReportType,
    loading,
    reportData,
    summary,
    pagination,
    filters,
    updateFilter,
    generateReport,
    exportReport,
    printReport,
  } = useGenerateReport();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // NEW: Export to CSV function
  const exportToCSV = async () => {
    if (!reportData || reportData.length === 0) {
      alert("No data available to export");
      return;
    }

    try {
      let csvContent = "";
      let filename = "";
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:.]/g, "-");

      if (activeReportType === "users") {
        // Users Report CSV
        const headers = [
          "ID",
          "Username",
          "First Name",
          "Last Name",
          "Full Name",
          "Role",
          "Status",
          "Has Profile Image",
          "Created Date",
          "Created Date (ISO)",
        ];

        const csvData = reportData.map((user) => [
          user.id,
          user.username,
          user.firstname,
          user.lastname,
          `${user.firstname} ${user.lastname}`,
          user.roletype,
          user.status,
          user.has_profile_image || "No",
          formatDate(user.created_at),
          user.created_at,
        ]);

        csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            row
              .map((field) =>
                typeof field === "string" &&
                (field.includes(",") || field.includes('"'))
                  ? `"${field.replace(/"/g, '""')}"`
                  : field
              )
              .join(",")
          ),
        ].join("\n");

        // Generate filename with filter info
        const filterParts = [];
        if (filters.role && filters.role !== "all")
          filterParts.push(filters.role);
        if (filters.status && filters.status !== "all")
          filterParts.push(filters.status);
        if (filters.start_date) filterParts.push(`from-${filters.start_date}`);
        if (filters.end_date) filterParts.push(`to-${filters.end_date}`);

        const filterString =
          filterParts.length > 0 ? `_${filterParts.join("_")}` : "";
        filename = `users_report${filterString}_${timestamp}.csv`;
      } else if (activeReportType === "activities") {
        // Activities Report CSV
        const headers = [
          "ID",
          "User ID",
          "User Full Name",
          "Category",
          "Activity Type",
          "Description",
          "IP Address",
          "Date & Time",
          "Date (ISO)",
          "Metadata",
        ];

        const csvData = reportData.map((activity) => [
          activity.id,
          activity.user_id || "N/A",
          activity.user_fullname || "N/A",
          activity.category || "N/A",
          activity.activity_type || "N/A",
          activity.activity_description || "N/A",
          activity.ip_address || "N/A",
          formatDate(activity.created_at),
          activity.created_at,
          activity.metadata ? JSON.stringify(activity.metadata) : "N/A",
        ]);

        csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            row
              .map((field) =>
                typeof field === "string" &&
                (field.includes(",") ||
                  field.includes('"') ||
                  field.includes("\n"))
                  ? `"${field.replace(/"/g, '""').replace(/\n/g, " ")}"`
                  : field
              )
              .join(",")
          ),
        ].join("\n");

        // Generate filename with filter info
        const filterParts = [];
        if (filters.category && filters.category !== "all")
          filterParts.push(filters.category);
        if (filters.activity_type && filters.activity_type !== "all")
          filterParts.push(filters.activity_type);
        if (filters.start_date) filterParts.push(`from-${filters.start_date}`);
        if (filters.end_date) filterParts.push(`to-${filters.end_date}`);

        const filterString =
          filterParts.length > 0 ? `_${filterParts.join("_")}` : "";
        filename = `activities_report${filterString}_${timestamp}.csv`;
      }

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        `Successfully exported ${reportData.length} ${activeReportType} records to ${filename}`
      );
    } catch (error) {
      console.error("CSV Export failed:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  // NEW: Export ALL filtered data to CSV (not just current page)
  const exportAllToCSV = async () => {
    if (!reportData) {
      alert("Please generate a report first");
      return;
    }

    try {
      // Make API call to get ALL data with current filters (no pagination)
      const params = new URLSearchParams({
        ...filters,
        page: 1,
        per_page: 10000, // Get all records
      });

      // Remove pagination-specific params for full export
      delete params.page;
      delete params.per_page;

      const endpoint =
        activeReportType === "users"
          ? `/admin/reports/users?${params}`
          : `/admin/reports/activities?${params}`;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}${endpoint}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch full report data");
      }

      const fullData = await response.json();
      const allRecords =
        fullData.data || fullData.activities || fullData.users || [];

      if (allRecords.length === 0) {
        alert("No data available for export with current filters");
        return;
      }

      // Generate CSV with all records
      let csvContent = "";
      let filename = "";
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:.]/g, "-");

      if (activeReportType === "users") {
        const headers = [
          "ID",
          "Username",
          "First Name",
          "Last Name",
          "Full Name",
          "Role",
          "Status",
          "Has Profile Image",
          "Created Date",
          "Created Date (ISO)",
        ];

        const csvData = allRecords.map((user) => [
          user.id,
          user.username,
          user.firstname,
          user.lastname,
          `${user.firstname} ${user.lastname}`,
          user.roletype,
          user.status,
          user.has_profile_image || "No",
          formatDate(user.created_at),
          user.created_at,
        ]);

        csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            row
              .map((field) =>
                typeof field === "string" &&
                (field.includes(",") || field.includes('"'))
                  ? `"${field.replace(/"/g, '""')}"`
                  : field
              )
              .join(",")
          ),
        ].join("\n");

        const filterParts = [];
        if (filters.role && filters.role !== "all")
          filterParts.push(filters.role);
        if (filters.status && filters.status !== "all")
          filterParts.push(filters.status);
        if (filters.start_date) filterParts.push(`from-${filters.start_date}`);
        if (filters.end_date) filterParts.push(`to-${filters.end_date}`);

        const filterString =
          filterParts.length > 0 ? `_${filterParts.join("_")}` : "";
        filename = `users_report_all${filterString}_${timestamp}.csv`;
      } else {
        const headers = [
          "ID",
          "User ID",
          "User Full Name",
          "Category",
          "Activity Type",
          "Description",
          "IP Address",
          "Date & Time",
          "Date (ISO)",
          "Metadata",
        ];

        const csvData = allRecords.map((activity) => [
          activity.id,
          activity.user_id || "N/A",
          activity.user_fullname || "N/A",
          activity.category || "N/A",
          activity.activity_type || "N/A",
          activity.activity_description || "N/A",
          activity.ip_address || "N/A",
          formatDate(activity.created_at),
          activity.created_at,
          activity.metadata ? JSON.stringify(activity.metadata) : "N/A",
        ]);

        csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            row
              .map((field) =>
                typeof field === "string" &&
                (field.includes(",") ||
                  field.includes('"') ||
                  field.includes("\n"))
                  ? `"${field.replace(/"/g, '""').replace(/\n/g, " ")}"`
                  : field
              )
              .join(",")
          ),
        ].join("\n");

        const filterParts = [];
        if (filters.category && filters.category !== "all")
          filterParts.push(filters.category);
        if (filters.activity_type && filters.activity_type !== "all")
          filterParts.push(filters.activity_type);
        if (filters.start_date) filterParts.push(`from-${filters.start_date}`);
        if (filters.end_date) filterParts.push(`to-${filters.end_date}`);

        const filterString =
          filterParts.length > 0 ? `_${filterParts.join("_")}` : "";
        filename = `activities_report_all${filterString}_${timestamp}.csv`;
      }

      // Download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        `Successfully exported ${allRecords.length} ${activeReportType} records to ${filename}`
      );
    } catch (error) {
      console.error("Full CSV Export failed:", error);
      alert("Failed to export full CSV. Please try again.");
    }
  };

  const renderFilters = () => {
    return (
      <div className="report-filters">
        <h3>
          <FiFilter size={20} />
          Filters
        </h3>

        <div className="filter-grid">
          {/* Date Range */}
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => updateFilter("start_date", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => updateFilter("end_date", e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Users Report Filters */}
          {activeReportType === "users" && (
            <>
              <div className="filter-group">
                <label>Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => updateFilter("role", e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                  <option value="biologist">Biologist</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </>
          )}

          {/* Activities Report Filters */}
          {activeReportType === "activities" && (
            <>
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="user_management">User Management</option>
                  <option value="coral_data">Coral Data</option>
                  <option value="image_analysis">Image Analysis</option>
                  <option value="system_admin">System Admin</option>
                  <option value="reports">Reports</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Activity Type</label>
                <select
                  value={filters.activity_type}
                  onChange={(e) =>
                    updateFilter("activity_type", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="all">All Activities</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="profile_update">Profile Update</option>
                  <option value="coral_upload">Coral Upload</option>
                  <option value="image_upload">Image Upload</option>
                  <option value="image_analysis">Image Analysis</option>
                  <option value="user_created">User Created</option>
                  <option value="user_updated">User Updated</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Items per page</label>
                <select
                  value={filters.per_page}
                  onChange={(e) =>
                    updateFilter("per_page", parseInt(e.target.value))
                  }
                  className="filter-select"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <div className="report-summarys">
        <div className="summary-header">
          <div className="summary-title">
            <h3>
              <FiBarChart size={20} />
              Summary Statistics
            </h3>
            <p className="summary-subtitle">
              {activeReportType === "users"
                ? "Overview of user statistics and metrics"
                : "Activity tracking and engagement metrics"}
            </p>
          </div>

          {/* NEW: Action buttons moved to summary header */}
          <div className="summary-actions">
            <div className="export-dropdown-container">
              <button
                className={`action-btn export-btn ${
                  !reportData ? "disabled" : ""
                }`}
                disabled={!reportData}
                title="Export Options"
              >
                <FiDownload size={16} />
                <span className="btn-text">Export</span>
                <div className="dropdown-arrow">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
              </button>

              {reportData && (
                <div className="export-dropdown-menu">
                  <div className="dropdown-header">
                    <span>Export Options</span>
                    <small>{reportData.length} records loaded</small>
                  </div>

                  <button onClick={exportToCSV} className="export-option">
                    <div className="option-icon csv">
                      <FiFile size={16} />
                    </div>
                    <div className="export-option-text">
                      <span>Current Page (CSV)</span>
                      <small>{reportData.length} records visible</small>
                    </div>
                    <div className="option-badge">CSV</div>
                  </button>

                  <button onClick={exportAllToCSV} className="export-option">
                    <div className="option-icon all-csv">
                      <FiDownload size={16} />
                    </div>
                    <div className="export-option-text">
                      <span>All Filtered Data</span>
                      <small>
                        {pagination
                          ? `${pagination.total_count} total records`
                          : "All matching records"}
                      </small>
                    </div>
                    <div className="option-badge">CSV</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="summary-grid">
          {activeReportType === "users" && <></>}

          {activeReportType === "activities" && (
            <>
              <div className="summary-card">
                <div className="summary-content">
                  <div className="summary-value">
                    {summary.total_activities || 0}
                  </div>
                  <div className="summary-label">Total Activities</div>
                  <div className="summary-trend">
                    <span className="trend-indicator positive">+18%</span>
                    <span className="trend-text">this week</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-content">
                  <div className="summary-value">
                    {summary.unique_users || 0}
                  </div>
                  <div className="summary-label">Active Users</div>
                  <div className="summary-trend">
                    <span className="trend-indicator positive">+7%</span>
                    <span className="trend-text">engagement rate</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-content">
                  <div className="summary-value">
                    {summary.unique_categories || 0}
                  </div>
                  <div className="summary-label">Categories</div>
                  <div className="summary-trend">
                    <span className="trend-indicator neutral">100%</span>
                    <span className="trend-text">coverage</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-content">
                  <div className="summary-value">
                    {summary.activities_today || 0}
                  </div>
                  <div className="summary-label">Today</div>
                  <div className="summary-trend">
                    <span className="trend-indicator positive">Live</span>
                    <span className="trend-text">real-time data</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
          {Math.min(
            pagination.current_page * pagination.per_page,
            pagination.total_count
          )}{" "}
          of {pagination.total_count} entries
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => updateFilter("page", pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <span className="pagination-current">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>

          <button
            className="pagination-btn"
            onClick={() => updateFilter("page", pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_pages}
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderReportData = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <div className="no-data">
          <FiFileText size={48} />
          <h3>No Data Found</h3>
          <p>Try adjusting your filters and generate the report again.</p>
        </div>
      );
    }

    return (
      <div className="content-section">
        <div className="report-table-container">
          {/* Users Report Table */}
          {activeReportType === "users" && (
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Profile Photo</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.username}</td>
                    <td>
                      {item.firstname} {item.lastname}
                    </td>
                    <td>
                      <span className={`role-badge ${item.roletype}`}>
                        {item.roletype}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.has_profile_image === "Yes" ? (
                        <span style={{ color: "#16a34a" }}>✓</span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>✗</span>
                      )}
                    </td>
                    <td>{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Activities Report Table */}
          {activeReportType === "activities" && (
            <div className="activities-table-container">
              <table className="report-table activities-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Activity Type</th>
                    <th>Description</th>
                    <th>IP Address</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.user_fullname}</td>
                      <td>
                        <span className={`category-badge ${item.category}`}>
                          {item.category?.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`activity-badge ${item.activity_type}`}
                        >
                          {item.activity_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="description-cell">
                        {item.activity_description}
                      </td>
                      <td
                        style={{ fontFamily: "monospace", fontSize: "0.85em" }}
                      >
                        {item.ip_address}
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination for activities */}
        {activeReportType === "activities" && renderPagination()}
      </div>
    );
  };

  // Auto-generate report when filters change (optional)
  useEffect(() => {
    if (reportData !== null) {
      generateReport();
    }
  }, [filters.page]); // Only auto-generate on page change

  return (
    <div className="content-section">
      <div className="report-generation-container">
        {/* Header Section */}
        <div className="report-header">
          <div className="report-header-text">
            <h2 className="report-title">Report Generation</h2>
            <p className="report-subtitle">
              Generate comprehensive reports with filtering and export options
            </p>
          </div>
          <div className="report-header-actions">
            {/* NEW: Export Dropdown */}
          </div>
        </div>
        <br />

        {/* Report Type Tabs */}
        <div className="report-tabs">
          <button
            className={`report-tab-btn ${
              activeReportType === "users" ? "active" : ""
            }`}
            onClick={() => setActiveReportType("users")}
          >
            <FiUsers size={18} />
            <span className="tab-text">Users Report</span>
          </button>

          <button
            className={`report-tab-btn ${
              activeReportType === "activities" ? "active" : ""
            }`}
            onClick={() => setActiveReportType("activities")}
          >
            <FiActivity size={18} />
            <span className="tab-text">Activities Report</span>
          </button>
        </div>
        <br />

        {/* Main Content */}
        <div className="report-content">
          {/* Filters Sidebar */}
          <div className="report-sidebar">
            {renderFilters()}
            <div className="filter-actions">
              <button
                className="generate-btn primary"
                onClick={generateReport}
                disabled={loading}
              >
                {loading ? (
                  <div className="btn-loading">
                    <div className="spinner-small"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <FiBarChart size={16} />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Report Display */}
          <div className="report-main">
            {summary && renderSummary()}
            {reportData && renderReportData()}

            {/* Empty State */}
            {!reportData && !loading && (
              <div className="report-empty-state">
                <div className="empty-icon">
                  <FiFileText size={48} />
                </div>
                <h3>No Report Generated</h3>
                <p>
                  Configure your filters and click "Generate Report" to view
                  data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateReport;
