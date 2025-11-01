import React, { useEffect } from "react";
import {
  FiDownload,
  FiPrinter,
  FiUsers,
  FiActivity,
  FiFilter,
  FiFileText,
  FiBarChart,
  FiChevronLeft,
  FiChevronRight,
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
      <div className="report-summary">
        <h3>
          <FiBarChart size={20} />
          Summary Statistics
        </h3>
        <div className="summary-grid">
          {activeReportType === "users" && (
            <>
              <div className="summary-card">
                <div className="summary-value">{summary.total_users}</div>
                <div className="summary-label">Total Users</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.approved_count}</div>
                <div className="summary-label">Approved</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.pending_count}</div>
                <div className="summary-label">Pending</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.users_with_photos}</div>
                <div className="summary-label">With Photos</div>
              </div>
            </>
          )}

          {activeReportType === "activities" && (
            <>
              <div className="summary-card">
                <div className="summary-value">{summary.total_activities}</div>
                <div className="summary-label">Total Activities</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.unique_users}</div>
                <div className="summary-label">Active Users</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.unique_categories}</div>
                <div className="summary-label">Categories</div>
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
