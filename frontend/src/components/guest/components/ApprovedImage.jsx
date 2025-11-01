import React, { useState, useEffect } from "react";
import {
  FiImage,
  FiCheck,
  FiX,
  FiPlay,
  FiEye,
  FiMapPin,
  FiBarChart,
  FiClock,
  FiRefreshCw,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiTarget,
  FiTrash2,
  FiGrid,
  FiList,
  FiSearch,
} from "react-icons/fi";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
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
import LocationSelector from "./LocationSelector";
import useApprovedImage from "../hooks/useApproveImage";
import "../styles/approveImage.css";

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

function ApprovedImage() {
  const {
    approvedImages,
    rejectedImages,
    analyzedImages,
    loading,
    userInfo,
    summary,
    fetchApprovedImages,
    fetchAnalyzedImages,
    analyzeImage,
    batchAnalyzeImages,
    analyzing,
  } = useApprovedImage();

  const [selectedImages, setSelectedImages] = useState(new Set());
  const [analysisResults, setAnalysisResults] = useState({});
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("approved");
  const [chartType, setChartType] = useState("bar");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAnalyzedImages, setSelectedAnalyzedImages] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [showBatchResults, setShowBatchResults] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchApprovedImages();
        if (activeTab === "analyzed") {
          await fetchAnalyzedImages();
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message);
      }
    };

    loadData();
  }, [activeTab, fetchApprovedImages, fetchAnalyzedImages]);

  // Add error display
  if (error) {
    return (
      <div className="approved-image-container">
        <div className="error-container">
          <FiAlertTriangle size={48} />
          <h3>Error Loading Images</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchApprovedImages();
            }}
            className="retry-btn"
          >
            <FiRefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        fetchApprovedImages();
      }
    } catch (error) {
      console.error("Batch analysis failed:", error);
      alert(`Batch analysis failed: ${error.message}`);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.size === 0) {
      alert("Please select images to delete");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_API_URL}/approved/guest/delete-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            image_ids: Array.from(selectedForDeletion),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully deleted ${data.deleted_count} image(s)`);
        setSelectedForDeletion(new Set());
        setShowDeleteConfirm(false);
        fetchApprovedImages(); // Refresh the list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete images");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleImageSelect = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAllApproved = () => {
    if (selectedImages.size === approvedImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(approvedImages.map((img) => img.id)));
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
        // Refresh the data
        fetchApprovedImages();
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error.message}`);
    }
  };

  const handleSaveWithLocation = () => {
    if (batchResults) {
      // Use batch results for location saving
      setShowLocationSelector(true);
    } else {
      // Original logic for individual images
      const analyzedImageData = Array.from(selectedImages)
        .map((imageId) => {
          const result = analysisResults[imageId];
          if (result) {
            return {
              image_id: imageId,
              coverage_data: result.coverage_data,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (analyzedImageData.length === 0) {
        alert("Please analyze images first before saving with location");
        return;
      }

      setSelectedAnalyzedImages(analyzedImageData);
      setShowLocationSelector(true);
    }
  };

  const generateChartData = (coverageData) => {
    if (!coverageData || coverageData.length === 0) return null;

    const labels = coverageData.map((item) => item.class_name);
    const data = coverageData.map((item) => item.coverage_percent);
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
        text: "Coral Coverage Analysis",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed.y || context.parsed}%`;
          },
        },
      },
    },
    scales:
      chartType === "bar"
        ? {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          }
        : {},
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

  const filteredImages = (images, isRejected = false) => {
    return images
      .filter((image) => {
        const matchesSearch = image.filename
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (filterStatus === "analyzed") {
          return matchesSearch && image.has_segmentation;
        } else if (filterStatus === "pending") {
          return matchesSearch && !image.has_segmentation;
        }

        return matchesSearch;
      })
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
  };

  const renderImageCard = (image, isRejected = false) => {
    const analysisResult = analysisResults[image.id];
    const isSelected = selectedImages.has(image.id);
    const isSelectedForDeletion = selectedForDeletion.has(image.id);
    const hasAnalysis = image.has_segmentation || analysisResult;

    return (
      <div
        key={image.id}
        className={`image-card ${isRejected ? "rejected" : "approved"} ${
          isSelected ? "selected" : ""
        } ${isSelectedForDeletion ? "selected-for-deletion" : ""} ${viewMode}`}
      >
        <div className="image-header">
          {!isRejected && (
            <>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleImageSelect(image.id)}
                className="image-checkbox"
              />
              <input
                type="checkbox"
                checked={isSelectedForDeletion}
                onChange={() => {
                  const newSelection = new Set(selectedForDeletion);
                  if (newSelection.has(image.id)) {
                    newSelection.delete(image.id);
                  } else {
                    newSelection.add(image.id);
                  }
                  setSelectedForDeletion(newSelection);
                }}
                className="delete-checkbox"
                title="Select for deletion"
              />
            </>
          )}
          <div className="image-status">
            {isRejected ? (
              <FiXCircle className="status-icon rejected" />
            ) : (
              <FiCheckCircle className="status-icon approved" />
            )}
            <span
              className={`status-text ${isRejected ? "rejected" : "approved"}`}
            >
              {isRejected ? "Rejected" : "Approved"}
            </span>
          </div>
          {hasAnalysis && (
            <div className="analysis-badge">
              <FiBarChart size={12} />
              <span>Analyzed</span>
            </div>
          )}
        </div>

        <div className="image-preview">
          <img
            src={`http://${process.env.REACT_APP_API_URL}/${image.image_url}`}
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

          {isRejected && (
            <div className="rejected-overlay">
              <FiX size={24} />
              <span>Rejected</span>
            </div>
          )}
        </div>

        <div className="image-info">
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
            {analysisResult ? (
              <div className="coverage-summary">
                <div className="coverage-chart-mini">
                  {generateChartData(analysisResult.coverage_data) && (
                    <Pie
                      data={generateChartData(analysisResult.coverage_data)}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) =>
                                `${context.label}: ${context.parsed}%`,
                            },
                          },
                        },
                      }}
                      height={100}
                    />
                  )}
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
            ) : (
              <div className="analysis-pending">
                <FiLoader size={16} className="spinning" />
                <span>Analysis available</span>
              </div>
            )}
          </div>
        )}

        {!isRejected && (
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
                  `http://${process.env.REACT_APP_API_URL}/${image.image_url}`,
                  "_blank"
                )
              }
            >
              <FiEye size={16} />
              View
            </button>

            {hasAnalysis && (
              <button
                className="location-btn success"
                onClick={() => {
                  setSelectedImages(new Set([image.id]));
                  handleSaveWithLocation();
                }}
              >
                <FiMapPin size={16} />
                Location
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAnalyzedImage = (image) => {
    return (
      <div key={image.id} className="analyzed-image-card">
        <div className="image-header">
          <div className="image-status">
            <FiCheckCircle className="status-icon approved" />
            <span>Analyzed</span>
          </div>
          {image.has_location && (
            <div className="location-badge">
              <FiMapPin size={12} />
              <span>Located</span>
            </div>
          )}
        </div>

        <div className="image-preview">
          <img
            src={`http://${process.env.REACT_APP_API_URL}/${image.image_url}`}
            alt={image.filename}
          />
        </div>

        <div className="image-info">
          <h4>{image.filename}</h4>
          <div className="analysis-summary">
            <div className="summary-stat">
              <span className="stat-number">{image.coral_types_found}</span>
              <span className="stat-label">Coral Types</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">
                {(image.total_pixels / 1000).toFixed(1)}K
              </span>
              <span className="stat-label">Pixels</span>
            </div>
          </div>
        </div>

        <div className="segmentation-chart">
          {image.segmentation_data && (
            <Doughnut
              data={{
                labels: image.segmentation_data.map((d) => d.class_name),
                datasets: [
                  {
                    data: image.segmentation_data.map(
                      (d) => d.coverage_percent
                    ),
                    backgroundColor: image.segmentation_data.map(
                      (d) => d.color_hex
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
            />
          )}
        </div>

        <div className="image-actions">
          <button
            onClick={() =>
              window.open(
                `http://${process.env.REACT_APP_API_URL}/${image.image_url}`,
                "_blank"
              )
            }
          >
            <FiEye size={16} />
            View
          </button>

          {!image.has_location && (
            <button
              onClick={() => {
                setSelectedAnalyzedImages([
                  {
                    image_id: image.id,
                    coverage_data: image.segmentation_data,
                  },
                ]);
                setShowLocationSelector(true);
              }}
            >
              <FiMapPin size={16} />
              Add Location
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading && approvedImages.length === 0) {
    return (
      <div className="approved-image-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your approved images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="approved-image-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <FiImage size={28} />
            Approved Images
          </h1>
          <p className="page-subtitle">
            Manage and analyze your approved coral quadrat images
          </p>
          {userInfo && (
            <div className="user-info">
              <span>Welcome, {userInfo.name}</span>
              <span className="user-role">({userInfo.role})</span>
            </div>
          )}
        </div>

        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={() => {
              fetchApprovedImages();
              if (activeTab === "analyzed") fetchAnalyzedImages();
            }}
            disabled={loading}
          >
            <FiRefreshCw size={16} className={loading ? "spinning" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card approved">
            <div className="card-icon">
              <FiCheckCircle size={24} />
            </div>
            <div className="card-content">
              <h3>{summary.total_approved}</h3>
              <p>Approved Images</p>
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

          <div className="summary-card rejected">
            <div className="card-icon">
              <FiXCircle size={24} />
            </div>
            <div className="card-content">
              <h3>{summary.total_rejected}</h3>
              <p>Rejected Images</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          <FiImage size={16} />
          Approved Images ({approvedImages.length})
        </button>

        <button
          className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          <FiXCircle size={16} />
          Rejected Images ({rejectedImages.length})
        </button>

        <button
          className={`tab-btn ${activeTab === "analyzed" ? "active" : ""}`}
          onClick={() => setActiveTab("analyzed")}
        >
          <FiBarChart size={16} />
          Analyzed Images
        </button>
      </div>

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

          {activeTab === "approved" && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Images</option>
              <option value="pending">Pending Analysis</option>
              <option value="analyzed">Already Analyzed</option>
            </select>
          )}
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
      {activeTab === "approved" &&
        (selectedImages.size > 0 || selectedForDeletion.size > 0) && (
          <div className="bulk-actions">
            <div className="selection-info">
              {selectedImages.size > 0 && (
                <span>
                  {selectedImages.size} image(s) selected for analysis
                </span>
              )}
              {selectedForDeletion.size > 0 && (
                <span className="delete-selection">
                  {selectedForDeletion.size} image(s) selected for deletion
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedImages(new Set());
                  setSelectedForDeletion(new Set());
                }}
              >
                Clear All
              </button>
            </div>

            <div className="bulk-buttons">
              {selectedImages.size > 0 && (
                <>
                  <button
                    className="bulk-analyze-btn"
                    onClick={handleBatchAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <FiLoader size={16} className="spinning" />
                    ) : (
                      <FiPlay size={16} />
                    )}
                    Analyze Selected ({selectedImages.size})
                  </button>

                  <button
                    className="bulk-location-btn"
                    onClick={handleSaveWithLocation}
                    disabled={Array.from(selectedImages).every(
                      (id) => !analysisResults[id]
                    )}
                  >
                    <FiMapPin size={16} />
                    Save with Location
                  </button>
                </>
              )}

              {selectedForDeletion.size > 0 && (
                <button
                  className="bulk-delete-btn danger"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                >
                  {deleting ? (
                    <FiLoader size={16} className="spinning" />
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                  Delete Selected ({selectedForDeletion.size})
                </button>
              )}
            </div>
          </div>
        )}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-confirm-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button onClick={() => setShowDeleteConfirm(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-content">
              <FiAlertTriangle size={48} color="#ef4444" />
              <p>
                Are you sure you want to delete {selectedForDeletion.size}{" "}
                image(s)? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <FiLoader size={16} className="spinning" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="images-content">
        {activeTab === "approved" && (
          <div className="images-section">
            {approvedImages.length === 0 ? (
              <div className="empty-state">
                <FiImage size={48} />
                <h3>No Approved Images</h3>
                <p>
                  Your uploaded images will appear here once approved by
                  administrators.
                </p>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <h3>Approved Images</h3>
                  <button
                    onClick={selectAllApproved}
                    className="select-all-btn"
                  >
                    {selectedImages.size === approvedImages.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>

                <div className={`images-grid ${viewMode}`}>
                  {filteredImages(approvedImages).map((image) =>
                    renderImageCard(image, false)
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "rejected" && (
          <div className="images-section">
            {rejectedImages.length === 0 ? (
              <div className="empty-state">
                <FiCheckCircle size={48} />
                <h3>No Rejected Images</h3>
                <p>Great! None of your images have been rejected.</p>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <h3>Rejected Images</h3>
                  <div className="rejection-notice">
                    <FiAlertTriangle size={16} />
                    <span>
                      These images cannot be analyzed and will not appear in
                      results
                    </span>
                  </div>
                </div>

                <div className={`images-grid ${viewMode}`}>
                  {filteredImages(rejectedImages, true).map((image) =>
                    renderImageCard(image, true)
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "analyzed" && (
          <div className="analyzed-section">
            {analyzedImages.length === 0 ? (
              <div className="empty-state">
                <FiBarChart size={48} />
                <h3>No Analyzed Images</h3>
                <p>
                  Analyze your approved images to see coral coverage results
                  here.
                </p>
              </div>
            ) : (
              <div className="analyzed-images-grid">
                {analyzedImages.map((image) => renderAnalyzedImage(image))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Selector Modal */}
      <LocationSelector
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSave={(location, result) => {
          console.log("Location saved:", location, result);
          // Refresh analyzed images if needed
          if (activeTab === "analyzed") {
            fetchAnalyzedImages();
          }
        }}
        processedImages={selectedAnalyzedImages}
      />
    </div>
  );
}

export default ApprovedImage;
