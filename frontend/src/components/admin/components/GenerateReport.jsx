// src/components/admin/components/GenerateReport.js
import React from "react";
import {
  FiDownload,
  FiPrinter,
  FiUsers,
  FiImage,
  FiActivity,
  FiFilter,
  FiFileText,
  FiBarChart,
} from "react-icons/fi";
import useGenerateReport from "../hooks/useGenerateReport";

function GenerateReport() {
  const {
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

          {/* Specific filters based on report type */}
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

          {activeReportType === "corals" && (
            <div className="filter-group">
              <label>Coral Type</label>
              <select
                value={filters.coral_type}
                onChange={(e) => updateFilter("coral_type", e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="hard">Hard Coral</option>
                <option value="soft">Soft Coral</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {activeReportType === "activities" && (
            <div className="filter-group">
              <label>Activity Type</label>
              <select
                value={filters.activity_type}
                onChange={(e) => updateFilter("activity_type", e.target.value)}
                className="filter-select"
              >
                <option value="all">All Activities</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="profile_update">Profile Update</option>
                <option value="coral_upload">Coral Upload</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
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
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              {activeReportType === "users" && (
                <>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Profile Photo</th>
                  <th>Created Date</th>
                </>
              )}

              {activeReportType === "corals" && (
                <>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Subtype</th>
                  <th>Scientific Name</th>
                  <th>Common Name</th>
                  <th>Has Image</th>
                  <th>Created Date</th>
                </>
              )}

              {activeReportType === "activities" && (
                <>
                  <th>ID</th>
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>Date & Time</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                {activeReportType === "users" && (
                  <>
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
                  </>
                )}

                {activeReportType === "corals" && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.coral_type}</td>
                    <td>{item.coral_subtype}</td>
                    <td>
                      <em>{item.scientific_name}</em>
                    </td>
                    <td>{item.common_name}</td>
                    <td>
                      {item.has_image === "Yes" ? (
                        <span style={{ color: "#16a34a" }}>✓</span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>✗</span>
                      )}
                    </td>
                    <td>{formatDate(item.created_at)}</td>
                  </>
                )}

                {activeReportType === "activities" && (
                  <>
                    <td>{item.id}</td>
                    <td>{item.user_fullname}</td>
                    <td>
                      <span className={`activity-badge ${item.activity_type}`}>
                        {item.activity_type}
                      </span>
                    </td>
                    <td>{item.activity_description}</td>
                    <td style={{ fontFamily: "monospace" }}>
                      {item.ip_address}
                    </td>
                    <td>{formatDate(item.created_at)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
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
          <button
            className={`report-action-btn secondary ${
              !reportData ? "disabled" : ""
            }`}
            onClick={printReport}
            disabled={!reportData}
            title="Print Report"
          >
            <FiPrinter size={16} />
            <span className="btn-text">Print</span>
          </button>
          <button
            className={`report-action-btn secondary ${
              !reportData ? "disabled" : ""
            }`}
            onClick={() => exportReport("excel")}
            disabled={!reportData}
            title="Export to Excel"
          >
            <FiDownload size={16} />
            <span className="btn-text">Excel</span>
          </button>
          <button
            className={`report-action-btn primary ${
              !reportData ? "disabled" : ""
            }`}
            onClick={() => exportReport("pdf")}
            disabled={!reportData}
            title="Export to PDF"
          >
            <FiDownload size={16} />
            <span className="btn-text">PDF</span>
          </button>
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
            activeReportType === "corals" ? "active" : ""
          }`}
          onClick={() => setActiveReportType("corals")}
        >
          <FiImage size={18} />
          <span className="tab-text">Corals Report</span>
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
                Configure your filters and click "Generate Report" to view data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateReport;
