import React, { useState } from "react";
import { FiDownload, FiFileText, FiGrid, FiBarChart } from "react-icons/fi";

const CoralCoverageTable = ({
  coralAnalytics,
  locationInfo,
  filters,
  className = "",
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "avg_coverage_percent",
    direction: "desc",
  });

  // Sort data
  const sortedData = React.useMemo(() => {
    const sortableData = [...(coralAnalytics || [])];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [coralAnalytics, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Export functions
  const exportToCSV = () => {
    console.log("Exporting coral coverage to CSV...", {
      coralAnalytics,
      locationInfo,
      filters,
    });

    const headers = [
      "Class Code",
      "Class Name",
      "Weighted Coverage %",
      "Avg Coverage %",
      "Occurrences",
    ];

    const csvContent = [
      headers.join(","),
      ...sortedData.map((coral) =>
        [
          coral.class_code || "N/A",
          `"${coral.class_name || ""}"`,
          (coral.weighted_coverage_percent || 0).toFixed(2),
          (coral.avg_coverage_percent || 0).toFixed(2),
          coral.occurrence_count || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `coral_coverage_${locationInfo?.lat}_${locationInfo?.lng}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    console.log("Exporting coral coverage to JSON...", {
      coralAnalytics,
      locationInfo,
      filters,
    });

    const exportData = {
      location: locationInfo,
      filters_applied: filters,
      export_timestamp: new Date().toISOString(),
      coral_data: sortedData,
      summary: {
        total_species: sortedData.length,
        total_weighted_coverage: sortedData.reduce(
          (sum, coral) => sum + (coral.weighted_coverage_percent || 0),
          0
        ),
        total_occurrences: sortedData.reduce(
          (sum, coral) => sum + (coral.occurrence_count || 0),
          0
        ),
        avg_confidence:
          sortedData.length > 0
            ? sortedData.reduce(
                (sum, coral) => sum + (coral.avg_confidence || 0),
                0
              ) / sortedData.length
            : 0,
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `coral_coverage_data_${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!coralAnalytics || coralAnalytics.length === 0) {
    return (
      <div className={`coral-coverage-table-container empty ${className}`}>
        <div className="table-header">
          <div className="table-title">
            <FiGrid size={20} />
            <h3>Coral Coverage Summary</h3>
          </div>
        </div>
        <div className="empty-state">
          <FiBarChart size={48} />
          <h4>No Coral Data Available</h4>
          <p>No coral analysis data found for the selected filters.</p>
        </div>
      </div>
    );
  }

  const totalAverageCoverage = sortedData.reduce(
    (sum, coral) => sum + (coral.avg_coverage_percent || 0),
    0
  );

  const averageCoverage =
    sortedData.length > 0 ? totalAverageCoverage / sortedData.length : 0;

  return (
    <div className={`coral-coverage-table-container ${className}`}>
      {/* Header */}
      <div className="table-header">
        <div className="table-title-section">
          <div className="table-title">
            <FiGrid size={20} />
            <h3>Coral Coverage Summary</h3>
          </div>
          <div className="table-summary">
            <span className="summary-item">
              <strong>{averageCoverage.toFixed(2)}%</strong> Total Weighted
              Coverage
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-item">
              <strong>{sortedData.length}</strong> Species
            </span>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="table-actions">
          <button
            onClick={exportToCSV}
            className="export-btn csv-btn"
            title="Export as CSV"
          >
            <FiFileText size={16} />
            CSV
          </button>
          <button
            onClick={exportToJSON}
            className="export-btn json-btn"
            title="Export as JSON"
          >
            <FiDownload size={16} />
            JSON
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="coral-coverage-table">
          <thead>
            <tr>
              <th
                className={`sortable ${
                  sortConfig.key === "class_code" ? "sorted" : ""
                }`}
                onClick={() => handleSort("class_code")}
              >
                Code
                {sortConfig.key === "class_code" && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${
                  sortConfig.key === "class_name" ? "sorted" : ""
                }`}
                onClick={() => handleSort("class_name")}
              >
                Coral Lifeforms
                {sortConfig.key === "class_name" && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>

              <th
                className={`sortable ${
                  sortConfig.key === "avg_coverage_percent" ? "sorted" : ""
                }`}
                onClick={() => handleSort("avg_coverage_percent")}
              >
                Average Coverage %
                {sortConfig.key === "avg_coverage_percent" && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className={`sortable ${
                  sortConfig.key === "occurrence_count" ? "sorted" : ""
                }`}
                onClick={() => handleSort("occurrence_count")}
              >
                Occurrences
                {sortConfig.key === "occurrence_count" && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((coral, index) => (
              <tr key={coral.class_name || index} className="coral-row">
                <td className="code-cell">
                  <span className="class-code">
                    {coral.class_code || "N/A"}
                  </span>
                </td>
                <td className="name-cell">
                  <div className="coral-name-wrapper">
                    {coral.color_hex && (
                      <div
                        className="color-indicator"
                        style={{ backgroundColor: coral.color_hex }}
                      />
                    )}
                    <span className="coral-name">{coral.class_name}</span>
                  </div>
                </td>
                <td className="coverage-cell">
                  <div className="coverage-display">
                    <div className="coverage-bar">
                      <div
                        className="coverage-fill"
                        style={{
                          width: `${Math.min(
                            ((coral.avg_coverage_percent || 0) / // CHANGED: Use avg_coverage_percent only
                              Math.max(totalAverageCoverage, 1)) *
                              100,
                            100
                          )}%`,
                          backgroundColor: coral.color_hex || "#3B82F6",
                        }}
                      />
                    </div>
                    <span className="tab-coverage-text">
                      <strong>
                        {(coral.avg_coverage_percent || 0).toFixed(2)}%{" "}
                        {/* CHANGED: Use avg_coverage_percent only */}
                      </strong>
                    </span>
                  </div>
                </td>
                <td className="count-cell">
                  <span className="occurrence-count">
                    {coral.occurrence_count || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoralCoverageTable;
