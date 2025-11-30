import React, { useState, useEffect } from "react";
import {
  FiImage,
  FiCheck,
  FiPlay,
  FiEye,
  FiMapPin,
  FiBarChart,
  FiClock,
  FiRefreshCw,
  FiLoader,
  FiCheckCircle,
  FiTarget,
  FiGrid,
  FiList,
  FiSearch,
  FiPieChart,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import GuestLocationSelector from "./GuestLocationSelector";
import usePendingApproved from "../hooks/usePendingApproved";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function PendingApprovedImages() {
  const {
    pendingApprovedImages,
    loading,
    analyzing,
    userInfo,
    summary,
    fetchPendingApprovedImages,
    analyzeImage,
    batchAnalyzeImages,
  } = usePendingApproved();

  const [selectedImages, setSelectedImages] = useState(new Set());
  const [analysisResults, setAnalysisResults] = useState({});
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [batchResults, setBatchResults] = useState(null);
  const [showBatchResults, setShowBatchResults] = useState(false);

  useEffect(() => {
    fetchPendingApprovedImages();
  }, [fetchPendingApprovedImages]);

  const handleImageSelect = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAll = () => {
    if (selectedImages.size === pendingApprovedImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(pendingApprovedImages.map((img) => img.id)));
    }
  };

  const handleAnalyzeImage = async (imageId) => {
    try {
      const result = await analyzeImage(imageId);
      if (result.success) {
        setAnalysisResults((prev) => ({
          ...prev,
          [imageId]: result.analysis_results,
        }));
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error.message}`);
    }
  };

  const handleBatchAnalyze = async () => {
    if (selectedImages.size === 0) {
      alert("Please select images to analyze");
      return;
    }

    try {
      const imageIds = Array.from(selectedImages);
      const results = await batchAnalyzeImages(imageIds);

      if (results.success) {
        setBatchResults(results);
        setShowBatchResults(true);

        // Process individual results
        const newAnalysisResults = {};
        results.results.forEach((result) => {
          if (result.success) {
            newAnalysisResults[result.image_id] = result.data;
          }
        });

        setAnalysisResults((prev) => ({
          ...prev,
          ...newAnalysisResults,
        }));

        setSelectedImages(new Set());
      }
    } catch (error) {
      console.error("Batch analysis failed:", error);
      alert(`Batch analysis failed: ${error.message}`);
    }
  };

  const handleSaveWithLocation = () => {
    if (!batchResults) {
      alert("Please analyze images first before saving with location");
      return;
    }

    setShowLocationSelector(true);
  };

  const generateChartData = (coverageData) => {
    if (!coverageData || coverageData.length === 0) return null;

    const labels = coverageData.map((item) => item.class_name);
    const data = coverageData.map((item) => item.avg_coverage_percent);
    const colors = coverageData.map((item) => item.color || "#3B82F6");

    return {
      labels,
      datasets: [
        {
          label: "Coverage Percentage",
          data,
          backgroundColor: colors,
          borderColor: colors.map((color) => color + "80"),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Coral Coverage Analysis Results",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const filteredImages = pendingApprovedImages
    .filter((image) =>
      image.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        case "oldest":
          return new Date(a.uploaded_at) - new Date(b.uploaded_at);
        case "filename":
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

  const renderImageCard = (image) => {
    const analysisResult = analysisResults[image.id];
    const isSelected = selectedImages.has(image.id);
    const hasAnalysis = image.has_segmentation || analysisResult;

    return (
      <div
        key={image.id}
        className={`pending-approved-card ${
          isSelected ? "selected" : ""
        } ${viewMode}`}
      >
        <div className="image-header">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleImageSelect(image.id)}
            className="image-checkbox"
          />
          {hasAnalysis && (
            <div className="analysis-badge">
              <FiBarChart size={12} />
              <span>Analyzed</span>
            </div>
          )}
        </div>

        <div className="image-preview">
          <img
            src={`${process.env.REACT_APP_API_URL}/${image.image_url}`}
            alt={image.filename}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="preview-placeholder" style={{ display: "none" }}>
            <FiImage size={32} />
            <span>Preview not available</span>
          </div>
        </div>

        <div className="app-image-info">
          <h4 className="image-filename">{image.filename}</h4>
          <div className="image-meta">
            <div className="meta-item">
              <FiClock size={12} />
              <span>{getTimeSince(image.uploaded_at)}</span>
            </div>
            {image.total_pixels && (
              <div className="meta-item">
                <FiTarget size={12} />
                <span>{(image.total_pixels / 1000).toFixed(1)}K pixels</span>
              </div>
            )}
            {image.analysis_confidence && (
              <div className="meta-item">
                <FiBarChart size={12} />
                <span>{(image.analysis_confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {(analysisResult || hasAnalysis) && (
          <div className="analysis-results">
            <h5>Analysis Results</h5>
            {analysisResult && analysisResult.coverage_data.length > 0 ? (
              <div className="coverage-summary">
                <div className="coverage-chart-mini">
                  <Pie
                    data={{
                      labels: analysisResult.coverage_data.map(
                        (coral) => coral.class_name
                      ),
                      datasets: [
                        {
                          data: analysisResult.coverage_data.map(
                            (coral) => coral.coverage_percent
                          ),
                          backgroundColor: analysisResult.coverage_data.map(
                            (coral) => coral.color || "#3B82F6"
                          ),
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                    height={100}
                  />
                </div>
                <div className="coverage-stats">
                  <div className="stat">
                    <span className="stat-label">Coral Types:</span>
                    <span className="stat-value">
                      {analysisResult.coral_types_count}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total Pixels:</span>
                    <span className="stat-value">
                      {(analysisResult.total_pixels / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              </div>
            ) : analysisResult && !analysisResult.has_coral_data ? (
              <div className="no-coral-found">
                <p>No coral coverage detected in this image</p>
              </div>
            ) : (
              <div className="analysis-pending">
                <FiLoader size={16} className="spinning" />
                <span>Analysis available</span>
              </div>
            )}
          </div>
        )}

        <div className="image-actions">
          {!hasAnalysis ? (
            <button
              className="analyze-btn primary"
              onClick={() => handleAnalyzeImage(image.id)}
              disabled={analyzing}
            >
              {analyzing ? (
                <FiLoader size={16} className="spinning" />
              ) : (
                <FiPlay size={16} />
              )}
              Analyze
            </button>
          ) : (
            <div className="analysis-complete">
              <FiCheckCircle size={16} />
              <span>Analyzed</span>
            </div>
          )}

          <button
            className="view-btn secondary"
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_API_URL}/${image.image_url}`,
                "_blank"
              )
            }
          >
            <FiEye size={16} />
            View
          </button>
        </div>
      </div>
    );
  };

  if (loading && pendingApprovedImages.length === 0) {
    return (
      <div className="pending-approved-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your pending approved images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approved-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-lefts">
          <h1 className="page-title">Approved Images</h1>
          <p className="page-subtitle">
            Analyze your approved coral quaddrat images and save with location
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card pending-approved">
            <div className="card-icon">
              <FiCheckCircle size={24} />
            </div>
            <div className="card-content">
              <h3>{summary.total_pending_approved}</h3>
              <p>Pending Approved</p>
            </div>
          </div>

          <div className="summary-card ready">
            <div className="card-icon">
              <FiTarget size={24} />
            </div>
            <div className="card-content">
              <h3>{summary.ready_for_analysis}</h3>
              <p>Ready for Analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter-controls">
          <div className="search-box">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="filename">By Filename</option>
          </select>
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <FiGrid size={16} />
          </button>

          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.size > 0 && (
        <div className="bulk-actions">
          <div className="selection-info">
            <span>{selectedImages.size} image(s) selected</span>
            <button onClick={() => setSelectedImages(new Set())}>
              Clear All
            </button>
          </div>

          <div className="bulk-buttons">
            <button
              className="bulk-analyze-btn"
              onClick={handleBatchAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <FiLoader size={16} className="spinning" />
              ) : (
                <FiPieChart size={16} />
              )}
              Analyze Selected ({selectedImages.size})
            </button>

            {batchResults && (
              <button
                className="bulk-location-btn"
                onClick={handleSaveWithLocation}
              >
                <FiMapPin size={16} />
                Save with Location
              </button>
            )}
          </div>
        </div>
      )}

      {/* Batch Results */}
      {showBatchResults && batchResults && (
        <div className="batch-results-section">
          <div className="batch-header">
            <h3>Batch Analysis Results</h3>
            <button
              className="close-results-btn"
              onClick={() => setShowBatchResults(false)}
            >
              ×
            </button>
          </div>

          <div className="batch-stats">
            <div className="stat-card">
              <span className="stat-number">
                {batchResults.batch_statistics.total_images_processed}
              </span>
              <span className="stat-label">Images Analyzed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {batchResults.aggregated_results.coral_types_found}
              </span>
              <span className="stat-label">Coral Types Found</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {(
                  batchResults.aggregated_results.total_pixels_analyzed / 1000
                ).toFixed(1)}
                K
              </span>
              <span className="stat-label">Total Pixels</span>
            </div>
          </div>

          {batchResults.aggregated_results.coral_coverage_data.length > 0 && (
            <div className="batch-charts">
              <div className="chart-section">
                <h4>Coral Coverage Distribution</h4>
                <div className="chart-container">
                  <Bar
                    data={generateChartData(
                      batchResults.aggregated_results.coral_coverage_data
                    )}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="batch-actions">
            <button
              className="save-location-btn primary"
              onClick={handleSaveWithLocation}
            >
              <FiMapPin size={16} />
              Save Results with Location
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="images-section">
        {pendingApprovedImages.length === 0 ? (
          <div className="empty-state">
            <FiImage size={48} />
            <h3>No Pending Approved Images</h3>
            <p>
              Your approved images will appear here and be ready for analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h3>Pending Approved Images</h3>
              <button onClick={selectAll} className="select-all-btn">
                {selectedImages.size === pendingApprovedImages.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className={`images-grid ${viewMode}`}>
              {filteredImages.map((image) => renderImageCard(image))}
            </div>
          </>
        )}
      </div>

      {/* Location Selector Modal */}
      <GuestLocationSelector
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSave={(location, result) => {
          console.log("Location saved:", location, result);
          setShowLocationSelector(false);
          setShowBatchResults(false);
          setBatchResults(null);
          fetchPendingApprovedImages();
        }}
        batchResults={batchResults}
      />
    </div>
  );
}

export default PendingApprovedImages;
