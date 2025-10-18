import React, { useState, useRef } from "react";
import {
  FiUpload,
  FiSettings,
  FiDownload,
  FiEye,
  FiLoader,
  FiX,
  FiFolder,
  FiGrid,
  FiList,
  FiFile,
  FiTrash2,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AddImage() {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [cropIntensity, setCropIntensity] = useState("conservative");
  const [dragActive, setDragActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("crops");
  const [batchResults, setBatchResults] = useState(null);
  const [showBatchChart, setShowBatchChart] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        return new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });
      });

    if (validFiles.length === 0) {
      alert("Please select a folder containing valid image files");
      return;
    }

    processFiles(validFiles);
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      alert("Please select valid image files (JPG, PNG, WEBP)");
      return;
    }

    if (validFiles.length > 50) {
      alert("Please select no more than 50 images at once");
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      crops: [],
      processed: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (images.length === 0) {
      setCurrentImageIndex(0);
    }
    setCrops([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setLoading(true);
    setActiveTab("crops"); // Switch to crops tab

    try {
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();

      const formData = new FormData();
      formData.append("image", images[currentImageIndex].file);
      formData.append("intensity", cropIntensity);
      formData.append("csrf_token", csrfData.csrf_token);

      const res = await fetch("http://localhost:5000/detect_custom", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCrops(data.crops);

      setImages((prev) =>
        prev.map((img, idx) =>
          idx === currentImageIndex
            ? { ...img, crops: data.crops, processed: true }
            : img
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSegmentAndDetect = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setLoading(true);
    setActiveTab("analysis"); // Switch to analysis tab

    try {
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();

      const formData = new FormData();
      formData.append("image", images[currentImageIndex].file);
      formData.append("intensity", cropIntensity);
      formData.append("csrf_token", csrfData.csrf_token);

      const res = await fetch("http://localhost:5000/detect_and_segment", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Update state with segmentation data
      setCrops(data.crops);

      setImages((prev) =>
        prev.map((img, idx) =>
          idx === currentImageIndex
            ? {
                ...img,
                crops: data.crops,
                processed: true,
                segmentationData: data, // Store full segmentation data
              }
            : img
        )
      );

      console.log("Segmentation results:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSegmentationMask = (maskUrl, index) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${maskUrl}`;
    link.download = `segmentation_${index + 1}_${
      images[currentImageIndex].file.name
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchSubmit = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setBatchLoading(true);
    setBatchProgress({ current: 0, total: images.length });

    try {
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const csrfData = await csrfResponse.json();
      const updatedImages = [...images];

      for (let i = 0; i < images.length; i++) {
        if (images[i].processed) continue;

        setBatchProgress({ current: i + 1, total: images.length });

        const formData = new FormData();
        formData.append("image", images[i].file);
        formData.append("intensity", cropIntensity);
        formData.append("csrf_token", csrfData.csrf_token);

        try {
          const res = await fetch("http://localhost:5000/detect_custom", {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              "X-CSRF-Token": csrfData.csrf_token,
            },
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
              errorData.error || `HTTP error! status: ${res.status}`
            );
          }

          const data = await res.json();
          updatedImages[i] = {
            ...updatedImages[i],
            crops: data.crops,
            processed: true,
          };
          setImages(updatedImages);

          if (i === currentImageIndex) {
            setCrops(data.crops);
          }
        } catch (error) {
          console.error(`Error processing image ${i}:`, error);
          updatedImages[i] = {
            ...updatedImages[i],
            error: error.message,
            processed: false,
          };
          setImages(updatedImages);
          continue;
        }
      }
    } catch (error) {
      console.error("Batch processing error:", error);
      alert("Batch processing failed: " + error.message);
    } finally {
      setBatchLoading(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setCurrentImageIndex(0);
    setCrops([]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);

    setImages(newImages);

    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }

    if (newImages.length === 0) {
      setCrops([]);
    } else if (index === currentImageIndex) {
      setCrops(newImages[currentImageIndex]?.crops || []);
    }
  };

  const downloadCrop = (cropUrl, index) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${cropUrl}`;
    link.download = `crop_${index + 1}_${images[currentImageIndex].file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const downloadAllCrops = () => {
  //   if (images.length === 0 || !images[currentImageIndex]?.crops?.length) {
  //     alert("No crops to download");
  //     return;
  //   }

  //   images[currentImageIndex].crops.forEach((crop, i) => {
  //     setTimeout(() => {
  //       downloadCrop(crop, i);
  //     }, i * 200);
  //   });
  // };

  const downloadBatchCrops = () => {
    let totalCrops = 0;
    images.forEach((image, imgIndex) => {
      if (image.crops && image.crops.length > 0) {
        image.crops.forEach((crop, cropIndex) => {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = `http://localhost:5000/${crop}`;
            link.download = `img_${imgIndex + 1}_crop_${cropIndex + 1}_${
              image.file.name
            }`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, totalCrops * 200);
          totalCrops++;
        });
      }
    });
  };

  const handleBatchAnalyze = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setBatchLoading(true);
    setShowBatchChart(false);
    setBatchProgress({ current: 0, total: images.length });

    try {
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();
      const formData = new FormData();

      // Add all image files to FormData
      images.forEach((image, index) => {
        formData.append("images", image.file);
      });

      formData.append("intensity", cropIntensity);
      formData.append("uploader_id", "1"); // Replace with actual user ID from context
      formData.append("csrf_token", csrfData.csrf_token);

      const res = await fetch("http://localhost:5000/batch_analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setBatchResults(data);
      setShowBatchChart(true);
      setActiveTab("batch-analysis");

      // Update images with results
      const updatedImages = images.map((image, index) => {
        const result = data.results.find((r) => r.filename === image.file.name);
        if (result) {
          return {
            ...image,
            crops: result.crops.map((crop) => crop.crop_url),
            processed: true,
            segmentationData: result,
          };
        }
        return image;
      });

      setImages(updatedImages);
    } catch (error) {
      console.error("Batch analysis error:", error);
      alert("Batch analysis failed: " + error.message);
    } finally {
      setBatchLoading(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  const renderBatchAnalysisChart = () => {
    if (!batchResults || !batchResults.batch_statistics) {
      return (
        <div className="no-results">No batch analysis results available</div>
      );
    }

    const coverageData = batchResults.batch_statistics.coverage_summary;

    if (!coverageData || coverageData.length === 0) {
      return <div className="no-results">No coral coverage data found</div>;
    }

    // Prepare data for charts
    const pieData = {
      labels: coverageData.map((coral) => coral.class_name),
      datasets: [
        {
          data: coverageData.map((coral) => coral.coverage_percent),
          backgroundColor: coverageData.map((coral) => coral.color),
          borderColor: coverageData.map((coral) => coral.color),
          borderWidth: 2,
        },
      ],
    };

    const barData = {
      labels: coverageData.map((coral) => coral.class_name),
      datasets: [
        {
          label: "Coverage Percentage",
          data: coverageData.map((coral) => coral.coverage_percent),
          backgroundColor: coverageData.map((coral) => coral.color),
          borderColor: coverageData.map((coral) => coral.color),
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const coral = coverageData[context.dataIndex];
              return `${coral.class_name}: ${
                coral.coverage_percent
              }% (${coral.total_pixels.toLocaleString()} pixels)`;
            },
          },
        },
      },
    };

    const barOptions = {
      ...chartOptions,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...coverageData.map((c) => c.coverage_percent)) * 1.1,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    };

    return (
      <div className="batch-analysis-results">
        <div className="batch-header">
          <h3>Batch Analysis Results</h3>
          <div className="batch-stats">
            <div className="stat-card">
              <span className="stat-number">
                {batchResults.batch_statistics.total_images}
              </span>
              <span className="stat-label">Images Analyzed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {batchResults.batch_statistics.total_crops}
              </span>
              <span className="stat-label">Quadrats Detected</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Math.round(
                  batchResults.batch_statistics.coverage_summary.reduce(
                    (sum, coral) => sum + coral.coverage_percent,
                    0
                  )
                )}
                %
              </span>
              <span className="stat-label">Total Coverage</span>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-section">
            <h4>Coverage Distribution - Pie Chart</h4>
            <div className="chart-wrapper">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-section">
            <h4>Coverage Distribution - Bar Chart</h4>
            <div className="chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        <div className="coverage-details">
          <h4>Detailed Coverage Results</h4>
          <div className="coverage-table">
            <div className="table-header">
              <span>Coral Type</span>
              <span>Category</span>
              <span>Coverage %</span>
              <span>Pixel Count</span>
            </div>
            {coverageData
              .sort((a, b) => b.coverage_percent - a.coverage_percent)
              .map((coral, index) => (
                <div key={index} className="table-row">
                  <div className="coral-name">
                    <div
                      className="color-indicator"
                      style={{ backgroundColor: coral.color }}
                    ></div>
                    {coral.class_name}
                  </div>
                  <span className="category">{coral.category}</span>
                  <span className="percentage">{coral.coverage_percent}%</span>
                  <span className="pixels">
                    {coral.total_pixels.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // const formatFileSize = (bytes) => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  // };

  const totalCrops = images.reduce(
    (sum, img) => sum + (img.crops?.length || 0),
    0
  );
  // const completedImages = images.filter((img) => img.processed).length;

  const renderAnalysisResults = () => {
    const currentImage = images[currentImageIndex];
    if (!currentImage?.segmentationData?.crops) {
      return <div className="no-results">No analysis results available</div>;
    }

    const segmentationData = currentImage.segmentationData;

    return (
      <div className="analysis-results">
        <div className="analysis-header">
          <h3>Coral Analysis Results</h3>
          <div className="analysis-stats">
            <span>{segmentationData.total_crops} quadrats analyzed</span>
            <span className="method-tag">
              {cropIntensity.charAt(0).toUpperCase() + cropIntensity.slice(1)}
            </span>
          </div>
        </div>

        <div className="quadrats-analysis">
          {segmentationData.crops.map((cropData, cropIndex) => (
            <div key={cropIndex} className="quadrat-analysis-card">
              <div className="quadrat-header">
                <h4>
                  Quadrat {cropIndex + 1} - {cropData.detection_label}
                </h4>
                <div className="quadrat-actions">
                  <button
                    className="download-btn small"
                    onClick={() => downloadCrop(cropData.crop_url, cropIndex)}
                  >
                    <FiDownload size={12} />
                    Crop
                  </button>
                  <button
                    className="download-btn small"
                    onClick={() =>
                      downloadSegmentationMask(
                        cropData.visualization_url,
                        cropIndex
                      )
                    }
                  >
                    <FiDownload size={12} />
                    Mask
                  </button>
                </div>
              </div>

              <div className="quadrat-content">
                <div className="quadrat-visuals">
                  <div className="visual-item">
                    <img
                      src={`http://localhost:5000/${cropData.crop_url}`}
                      alt={`Crop ${cropIndex + 1}`}
                      className="analysis-image"
                    />
                    <span className="visual-label">Original Crop</span>
                  </div>
                  <div className="visual-item">
                    <img
                      src={`http://localhost:5000/${cropData.visualization_url}`}
                      alt={`Segmentation ${cropIndex + 1}`}
                      className="analysis-image"
                    />
                    <span className="visual-label">Segmentation Mask</span>
                  </div>
                </div>

                {cropData.coverage_data &&
                  cropData.coverage_data.length > 0 && (
                    <div className="coverage-analysis">
                      <h5>Coral Coverage</h5>
                      <div className="coverage-stats">
                        {cropData.coverage_data.map((coral, coralIndex) => (
                          <div key={coralIndex} className="coral-stat">
                            <div
                              className="coral-color"
                              style={{ backgroundColor: coral.color }}
                            ></div>
                            <div className="coral-info">
                              <span className="coral-name">
                                {coral.class_name}
                              </span>
                              <span className="coral-category">
                                {coral.category}
                              </span>
                            </div>
                            <div className="coral-coverage">
                              <span className="coverage-percent">
                                {coral.coverage_percent}%
                              </span>
                              <span className="pixel-count">
                                ({coral.pixel_count.toLocaleString()} px)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Coverage Summary */}
                      <div className="total-coverage">
                        <strong>Total Coral Coverage: </strong>
                        {cropData.coverage_data
                          .reduce(
                            (sum, coral) => sum + coral.coverage_percent,
                            0
                          )
                          .toFixed(1)}
                        %
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="content-section">
      {images.length === 0 ? (
        <div className="upload-section-empty">
          <div
            className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <div className="upload-icon">
                <FiUpload size={40} />
              </div>

              <div className="upload-text">
                <h3>Drag & drop images or folders here</h3>
                <p>
                  Support for batch processing • JPG, PNG, WEBP formats • Up to
                  50 images
                </p>
              </div>

              <div className="upload-buttons">
                <button
                  className="upload-button primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiFile size={18} />
                  <span>Select Images</span>
                </button>

                <button
                  className="upload-button secondary"
                  onClick={() => folderInputRef.current?.click()}
                >
                  <FiFolder size={18} />
                  <span>Select Folder</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden-input"
            />

            <input
              ref={folderInputRef}
              type="file"
              onChange={handleFolderUpload}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              webkitdirectory=""
              className="hidden-input"
            />
          </div>

          <div className="controls-section-empty">
            <div className="intensity-control">
              <label className="intensity-label">
                <FiSettings size={18} />
                <span>Cropping Intensity:</span>
              </label>
              <select
                value={cropIntensity}
                onChange={(e) => setCropIntensity(e.target.value)}
                className="intensity-select"
              >
                <option value="conservative">
                  Conservative (5% crop) - Recommended
                </option>
                <option value="moderate">Moderate (12% crop)</option>
                <option value="aggressive">Aggressive (18% crop)</option>
                <option value="smart">Smart (Edge Detection)</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="add-image-content">
          {/* Top Controls Bar - UPDATED */}
          <div className="top-controls">
            <div className="controls-left">
              <div className="intensity-control-compact">
                <label className="intensity-label-compact">
                  <FiSettings size={16} />
                  <span className="label-text">Intensity:</span>
                </label>
                <select
                  value={cropIntensity}
                  onChange={(e) => setCropIntensity(e.target.value)}
                  className="intensity-select-compact"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                  <option value="smart">Smart</option>
                </select>
              </div>
            </div>

            <div className="controls-right">
              <div className="process-buttons-compact">
                <button
                  onClick={handleSubmit}
                  disabled={images.length === 0 || loading || batchLoading}
                  className="process-button primary compact"
                >
                  {loading && activeTab === "crops" ? (
                    <>
                      <FiLoader size={16} className="spinning" />
                      <span className="btn-text">Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiEye size={16} />
                      <span className="btn-text">Detect Only</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSegmentAndDetect}
                  disabled={images.length === 0 || loading || batchLoading}
                  className="process-button secondary compact"
                >
                  {loading && activeTab === "analysis" ? (
                    <>
                      <FiLoader size={16} className="spinning" />
                      <span className="btn-text">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <FiBarChart2 size={16} />
                      <span className="btn-text">Analyze Single</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBatchAnalyze}
                  disabled={images.length === 0 || batchLoading}
                  className="process-button analysis compact"
                >
                  {batchLoading ? (
                    <>
                      <FiLoader size={16} className="spinning" />
                      <span className="btn-text">
                        Analyzing {batchProgress.current}/{batchProgress.total}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiPieChart size={16} />
                      <span className="btn-text">Batch Analyze All</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Section - Same as before */}
          <div className="gallery-section">
            {/* ... existing gallery JSX ... */}
          </div>

          {/* Results Section - UPDATED with new tab */}
          {(crops.length > 0 ||
            images[currentImageIndex]?.segmentationData ||
            showBatchChart) && (
            <div className="results-section">
              <div className="results-tabs">
                <button
                  className={`tab-button ${
                    activeTab === "crops" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("crops")}
                >
                  <FiGrid size={16} />
                  <span>Detected Crops ({crops.length})</span>
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "analysis" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("analysis")}
                >
                  <FiBarChart2 size={16} />
                  <span>Single Analysis</span>
                </button>
                {showBatchChart && (
                  <button
                    className={`tab-button ${
                      activeTab === "batch-analysis" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("batch-analysis")}
                  >
                    <FiPieChart size={16} />
                    <span>Batch Analysis</span>
                  </button>
                )}
              </div>

              <div className="tab-content">
                {activeTab === "crops" && (
                  <div className="crops-grid">
                    {crops.map((crop, i) => (
                      <div key={i} className="crop-card">
                        <div className="crop-image-container">
                          <img
                            src={`http://localhost:5000/${crop}`}
                            alt={`Crop ${i + 1}`}
                            className="crop-image"
                          />
                          <div className="crop-overlay">
                            <button
                              className="download-crop-btn"
                              onClick={() => downloadCrop(crop, i)}
                              title="Download crop"
                            >
                              <FiDownload size={14} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                        <div className="crop-info">
                          <span className="crop-label">Crop {i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "analysis" && renderAnalysisResults()}
                {activeTab === "batch-analysis" && renderBatchAnalysisChart()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || batchLoading) && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {batchLoading ? "Analyzing Batch..." : "Processing Image..."}
            </div>
            <div className="loading-subtext">
              {batchLoading
                ? `Processing ${batchProgress.current} of ${batchProgress.total} images`
                : "Please wait while we analyze your image"}
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: batchLoading
                    ? `${(batchProgress.current / batchProgress.total) * 100}%`
                    : "50%",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddImage;
