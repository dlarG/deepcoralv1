import React, { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  FiUpload,
  FiSettings,
  FiDownload,
  FiLoader,
  FiX,
  FiFolder,
  FiGrid,
  FiList,
  FiFile,
  FiTrash2,
  FiBarChart2,
  FiPieChart,
  FiSave,
  FiMap,
  FiAlertTriangle,
  FiCheckCircle,
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
import LocationSelector from "./LocationSelector";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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
  const { user } = useAuth();

  // New GIS and validation states
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [processedImagesForSaving, setProcessedImagesForSaving] = useState([]);
  const [rejectedImages, setRejectedImages] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);

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
      status: "pending", // pending, validating, valid, invalid, processed
      quadratsDetected: 0,
      rejectionReason: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (images.length === 0) {
      setCurrentImageIndex(0);
    }
    setCrops([]);
    setShowSaveButton(false);
    setSavedToDatabase(false);
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

  // const handleSubmit = async () => {
  //   if (images.length === 0) {
  //     alert("Please select images first!");
  //     return;
  //   }

  //   const currentImage = images[currentImageIndex];

  //   // Validate first if not already validated
  //   if (currentImage.status === "pending") {
  //     setLoading(true);
  //     const validation = await validateImageForQuadrats(currentImage.file);

  //     if (!validation.valid) {
  //       setImages((prev) =>
  //         prev.map((img, idx) =>
  //           idx === currentImageIndex
  //             ? {
  //                 ...img,
  //                 status: "invalid",
  //                 rejectionReason: validation.reason,
  //               }
  //             : img
  //         )
  //       );
  //       setLoading(false);
  //       alert(`Image rejected: ${validation.reason}`);
  //       return;
  //     }

  //     setImages((prev) =>
  //       prev.map((img, idx) =>
  //         idx === currentImageIndex
  //           ? {
  //               ...img,
  //               status: "valid",
  //               quadratsDetected: validation.quadratCount,
  //             }
  //           : img
  //       )
  //     );
  //   }

  //   if (currentImage.status === "invalid") {
  //     alert(`Cannot process invalid image: ${currentImage.rejectionReason}`);
  //     return;
  //   }

  //   setLoading(true);
  //   setActiveTab("crops");

  //   try {
  //     const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     const csrfData = await csrfResponse.json();

  //     const formData = new FormData();
  //     formData.append("image", currentImage.file);
  //     formData.append("intensity", cropIntensity);
  //     formData.append("csrf_token", csrfData.csrf_token);

  //     const res = await fetch("http://localhost:5000/detect_custom", {
  //       method: "POST",
  //       body: formData,
  //       credentials: "include",
  //       headers: {
  //         "X-CSRF-Token": csrfData.csrf_token,
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     setCrops(data.crops);

  //     setImages((prev) =>
  //       prev.map((img, idx) =>
  //         idx === currentImageIndex
  //           ? {
  //               ...img,
  //               crops: data.crops,
  //               processed: true,
  //               status: "processed",
  //             }
  //           : img
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to process image: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSegmentAndDetect = async () => {
  //   if (images.length === 0) {
  //     alert("Please select images first!");
  //     return;
  //   }

  //   const currentImage = images[currentImageIndex];

  //   if (currentImage.status === "invalid") {
  //     alert(`Cannot process invalid image: ${currentImage.rejectionReason}`);
  //     return;
  //   }

  //   setLoading(true);
  //   setActiveTab("analysis");

  //   try {
  //     const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     const csrfData = await csrfResponse.json();

  //     const formData = new FormData();
  //     formData.append("image", currentImage.file);
  //     formData.append("intensity", cropIntensity);
  //     formData.append("csrf_token", csrfData.csrf_token);

  //     const res = await fetch("http://localhost:5000/detect_and_segment", {
  //       method: "POST",
  //       body: formData,
  //       credentials: "include",
  //       headers: {
  //         "X-CSRF-Token": csrfData.csrf_token,
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();

  //     setCrops(data.crops);
  //     setShowSaveButton(true);

  //     setImages((prev) =>
  //       prev.map((img, idx) =>
  //         idx === currentImageIndex
  //           ? {
  //               ...img,
  //               crops: data.crops,
  //               processed: true,
  //               status: "processed",
  //               segmentationData: data,
  //             }
  //           : img
  //       )
  //     );

  //     setProcessedImagesForSaving([images[currentImageIndex]]);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to analyze image: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // const handleBatchSubmit = async () => {
  //   if (images.length === 0) {
  //     alert("Please select images first!");
  //     return;
  //   }

  //   setBatchLoading(true);
  //   setBatchProgress({ current: 0, total: images.length });

  //   try {
  //     const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!csrfResponse.ok) {
  //       throw new Error("Failed to get CSRF token");
  //     }

  //     const csrfData = await csrfResponse.json();
  //     const updatedImages = [...images];

  //     for (let i = 0; i < images.length; i++) {
  //       if (images[i].processed) continue;

  //       setBatchProgress({ current: i + 1, total: images.length });

  //       const formData = new FormData();
  //       formData.append("image", images[i].file);
  //       formData.append("intensity", cropIntensity);
  //       formData.append("csrf_token", csrfData.csrf_token);

  //       try {
  //         const res = await fetch("http://localhost:5000/detect_custom", {
  //           method: "POST",
  //           body: formData,
  //           credentials: "include",
  //           headers: {
  //             "X-CSRF-Token": csrfData.csrf_token,
  //           },
  //         });

  //         if (!res.ok) {
  //           const errorData = await res.json().catch(() => ({}));
  //           throw new Error(
  //             errorData.error || `HTTP error! status: ${res.status}`
  //           );
  //         }

  //         const data = await res.json();
  //         updatedImages[i] = {
  //           ...updatedImages[i],
  //           crops: data.crops,
  //           processed: true,
  //         };
  //         setImages(updatedImages);

  //         if (i === currentImageIndex) {
  //           setCrops(data.crops);
  //         }
  //       } catch (error) {
  //         console.error(`Error processing image ${i}:`, error);
  //         updatedImages[i] = {
  //           ...updatedImages[i],
  //           error: error.message,
  //           processed: false,
  //         };
  //         setImages(updatedImages);
  //         continue;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Batch processing error:", error);
  //     alert("Batch processing failed: " + error.message);
  //   } finally {
  //     setBatchLoading(false);
  //     setBatchProgress({ current: 0, total: 0 });
  //   }
  // };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setCurrentImageIndex(0);
    setCrops([]);
    setRejectedImages([]);
    setShowSaveButton(false);
    setSavedToDatabase(false);
    setBatchResults(null);
    setShowBatchChart(false);
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
      setShowSaveButton(false);
      setSavedToDatabase(false);
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

  const validateImageForQuadrats = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("intensity", "conservative");

      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });
      const csrfData = await csrfResponse.json();
      formData.append("csrf_token", csrfData.csrf_token);

      const response = await fetch("http://localhost:5000/detect_custom", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      const data = await response.json();

      if (response.ok && data.crops && data.crops.length > 0) {
        return { valid: true, quadratCount: data.crops.length };
      } else {
        return {
          valid: false,
          quadratCount: 0,
          reason: "No coral quadrats detected in this image",
        };
      }
    } catch (error) {
      return {
        valid: false,
        quadratCount: 0,
        reason: "Failed to validate image: " + error.message,
      };
    }
  };

  const validateAllImages = async () => {
    setLoading(true);
    const updatedImages = [...images];
    const rejected = [];

    for (let i = 0; i < images.length; i++) {
      if (images[i].processed) continue;

      updatedImages[i].status = "validating";
      setImages([...updatedImages]);

      const validation = await validateImageForQuadrats(images[i].file);

      if (validation.valid) {
        updatedImages[i].status = "valid";
        updatedImages[i].quadratsDetected = validation.quadratCount;
      } else {
        updatedImages[i].status = "invalid";
        updatedImages[i].rejectionReason = validation.reason;
        rejected.push({
          ...images[i],
          rejectionReason: validation.reason,
        });
      }

      setImages([...updatedImages]);
    }

    setRejectedImages(rejected);
    setLoading(false);

    // Show validation results
    const validCount = updatedImages.filter(
      (img) => img.status === "valid"
    ).length;
    const invalidCount = rejected.length;

    if (invalidCount > 0) {
      alert(
        `Validation complete: ${validCount} images are valid, ${invalidCount} images were rejected for not containing coral quadrats.`
      );
    } else {
      alert(`All ${validCount} images are valid and contain coral quadrats!`);
    }
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

    const validImages = images.filter(
      (img) => img.status === "valid" || img.status === "pending"
    );

    if (validImages.length === 0) {
      alert("No valid images to process. Please validate your images first.");
      return;
    }

    setBatchLoading(true);
    setShowBatchChart(false);
    setBatchProgress({ current: 0, total: validImages.length });

    try {
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();
      const formData = new FormData();

      validImages.forEach((image) => {
        formData.append("images", image.file);
      });

      formData.append("intensity", cropIntensity);

      // FIXED: Get actual user ID instead of hardcoded "1"
      const currentUserId = user?.id || "9";
      console.log("Using uploader_id:", currentUserId);
      formData.append("uploader_id", currentUserId);

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

      console.log("Batch analysis complete. Data structure:", data);

      setBatchResults(data);
      setShowBatchChart(true);
      setActiveTab("batch-analysis");
      setShowSaveButton(true);

      // Process the results properly
      const processedImagesWithData = validImages.map((image, index) => {
        const result = data.results.find((r) => r.filename === image.file.name);
        if (result && result.crops) {
          console.log(`Processing result for ${image.file.name}:`, result);

          return {
            ...image,
            crops: result.crops.map((crop) => crop.crop_url),
            processed: true,
            status: "processed",
            segmentationData: {
              crops: result.crops,
              total_crops: result.crops.length,
              filename: result.filename,
            },
          };
        }
        return image;
      });

      console.log("Processed images for saving:", processedImagesWithData);
      setProcessedImagesForSaving(processedImagesWithData);

      const updatedImages = images.map((image) => {
        const result = data.results.find((r) => r.filename === image.file.name);
        if (result && result.crops) {
          return {
            ...image,
            crops: result.crops.map((crop) => crop.crop_url),
            processed: true,
            status: "processed",
            segmentationData: {
              crops: result.crops,
              total_crops: result.crops.length,
              filename: result.filename,
            },
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

  const handleSaveToDatabase = () => {
    if (!showSaveButton) {
      alert("No processed data to save. Please analyze images first.");
      return;
    }

    setShowLocationSelector(true);
  };

  const handleLocationSaved = (location, saveResult) => {
    setSavedToDatabase(true);
    setShowSaveButton(false);
    console.log("Location saved:", location, saveResult);
  };

  const renderImageGallery = () => {
    return (
      <div className="gallery-section">
        <div className="gallery-header">
          <div className="gallery-title">
            <FiGrid size={20} />
            <span>Image Gallery ({images.length})</span>
          </div>

          <div className="gallery-header-actions">
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <FiGrid size={16} />
              </button>
              <button
                className={`view-toggle-btn ${
                  viewMode === "list" ? "active" : ""
                }`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <FiList size={16} />
              </button>
            </div>

            <div className="gallery-actions">
              <button onClick={clearImages} className="action-button clear">
                <FiTrash2 size={14} />
                <span className="action-text">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Status Summary */}
        <div className="image-status-summary">
          <div className="status-item">
            <span className="status-count valid">
              {
                images.filter(
                  (img) => img.status === "valid" || img.status === "processed"
                ).length
              }
            </span>
            <span className="status-label">Valid</span>
          </div>
          <div className="status-item">
            <span className="status-count invalid">
              {images.filter((img) => img.status === "invalid").length}
            </span>
            <span className="status-label">Invalid</span>
          </div>
          <div className="status-item">
            <span className="status-count pending">
              {images.filter((img) => img.status === "pending").length}
            </span>
            <span className="status-label">Pending</span>
          </div>
        </div>

        <div className={`image-gallery ${viewMode}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`gallery-item ${
                index === currentImageIndex ? "active" : ""
              } ${image.status} ${image.processed ? "processed" : ""}`}
              onClick={() => {
                setCurrentImageIndex(index);
                const currentCrops = image.crops || [];
                setCrops(currentCrops);
              }}
            >
              <div className="item-thumbnail">
                <img src={image.preview} alt={`Thumbnail ${index}`} />

                <div className="thumbnail-overlay">
                  {/* Status indicator */}
                  <div className={`status-indicator ${image.status}`}>
                    {image.status === "valid" && <FiCheckCircle size={12} />}
                    {image.status === "invalid" && <FiX size={12} />}
                    {image.status === "validating" && (
                      <FiLoader size={12} className="spinning" />
                    )}
                    {image.status === "processed" && (
                      <FiCheckCircle size={12} />
                    )}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    title="Remove image"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              </div>

              <div className="item-info">
                <span className="filename" title={image.file.name}>
                  {image.file.name}
                </span>
                <div className="item-status">
                  {image.status === "valid" && (
                    <span className="quadrat-count">
                      {image.quadratsDetected} quadrat
                      {image.quadratsDetected !== 1 ? "s" : ""} detected
                    </span>
                  )}
                  {image.status === "invalid" && (
                    <span className="error-text" title={image.rejectionReason}>
                      No quadrats detected
                    </span>
                  )}
                  {image.status === "processed" && image.crops?.length > 0 && (
                    <span className="crop-count">
                      {image.crops.length} crop
                      {image.crops.length > 1 ? "s" : ""} processed
                    </span>
                  )}
                  {image.status === "validating" && (
                    <span className="validating-text">Validating...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rejected Images Panel */}
        {rejectedImages.length > 0 && (
          <div className="rejected-images-panel">
            <h4>
              <FiAlertTriangle size={16} />
              Rejected Images ({rejectedImages.length})
            </h4>
            <div className="rejected-list">
              {rejectedImages.map((image, index) => (
                <div key={index} className="rejected-item">
                  <span className="filename">{image.file.name}</span>
                  <span className="rejection-reason">
                    {image.rejectionReason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                {batchResults.batch_statistics.total_crops}
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

          {/* Save to Database Button */}
          {showSaveButton && !savedToDatabase && (
            <div className="save-section">
              <button className="save-to-db-btn" onClick={handleSaveToDatabase}>
                <FiSave size={16} />
                <FiMap size={16} />
                Save to Database with Location
              </button>
            </div>
          )}

          {savedToDatabase && (
            <div className="saved-indicator">
              <FiCheckCircle size={16} />
              <span>Successfully saved to database with location!</span>
            </div>
          )}
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
                <h3>Drag & drop coral images or folders here</h3>
                <p>
                  Images will be validated for coral quadrats • JPG, PNG, WEBP
                  formats • Up to 50 images
                </p>
              </div>

              <div className="upload-buttons">
                <button
                  className="up-button pri"
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
          {/* Top Controls Bar */}
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
                  onClick={validateAllImages}
                  disabled={loading || batchLoading}
                  className="upload-button secondary"
                >
                  <FiCheckCircle size={16} />
                  <span>Validate All</span>
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
                      <span className="btn-text">Start Analyzing</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-content-area">
            {/* Render Image Gallery */}
            {renderImageGallery()}

            {/* Results Section */}
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
                    <div className="crops-section">
                      <div className="crops-header">
                        <div className="crops-title">
                          <FiGrid size={20} />
                          <span>Detected Crops ({crops.length})</span>
                        </div>
                        <div className="method-tag">
                          {cropIntensity.charAt(0).toUpperCase() +
                            cropIntensity.slice(1)}
                        </div>
                        {totalCrops > 0 && (
                          <button
                            onClick={downloadBatchCrops}
                            className="download-all-btn"
                          >
                            <FiDownload size={16} />
                            Download All ({totalCrops})
                          </button>
                        )}
                      </div>

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
                    </div>
                  )}

                  {activeTab === "analysis" && renderAnalysisResults()}
                  {activeTab === "batch-analysis" && renderBatchAnalysisChart()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          isOpen={showLocationSelector}
          onClose={() => setShowLocationSelector(false)}
          onSave={handleLocationSaved}
          processedImages={processedImagesForSaving}
          batchResults={batchResults}
        />
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
