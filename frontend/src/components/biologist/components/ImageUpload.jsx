import React, { useState, useRef } from "react";
import {
  FiUpload,
  FiSettings,
  FiDownload,
  FiEye,
  FiLoader,
  FiX,
  FiCheck,
  FiFolder,
  FiGrid,
  FiList,
  FiFile,
  FiTrash2,
} from "react-icons/fi";
import "../styles/uploadImage.css";
import { API_BASE_URL } from "../../../config/api";

function UploadImage() {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [cropIntensity, setCropIntensity] = useState("conservative");
  const [dragActive, setDragActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [viewMode, setViewMode] = useState("grid");
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

    try {
      const csrfResponse = await fetch(
        `${API_BASE_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const csrfData = await csrfResponse.json();

      const formData = new FormData();
      formData.append("image", images[currentImageIndex].file);
      formData.append("intensity", cropIntensity);
      formData.append("csrf_token", csrfData.csrf_token);

      const res = await fetch(
        `${API_BASE_URL}/detect_custom`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfData.csrf_token,
          },
        }
      );

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

  const handleBatchSubmit = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setBatchLoading(true);
    setBatchProgress({ current: 0, total: images.length });

    try {
      const csrfResponse = await fetch(
        `${API_BASE_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

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
          const res = await fetch(
            `${API_BASE_URL}/detect_custom`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
              headers: {
                "X-CSRF-Token": csrfData.csrf_token,
              },
            }
          );

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
    link.href = `${API_BASE_URL}/${cropUrl}`;
    link.download = `crop_${index + 1}_${images[currentImageIndex].file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBatchCrops = () => {
    let totalCrops = 0;
    images.forEach((image, imgIndex) => {
      if (image.crops && image.crops.length > 0) {
        image.crops.forEach((crop, cropIndex) => {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = `${API_BASE_URL}/${crop}`;
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

  const totalCrops = images.reduce(
    (sum, img) => sum + (img.crops?.length || 0),
    0
  );

  return (
    <>
      {images.length === 0 ? (
        <div className="upload-section">
          <div
            className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <FiUpload size={40} />
            </div>

            <div className="upload-text">
              <h3>Drag & drop images or folders here</h3>
              <p>
                Support for batch processing • JPG, PNG, WEBP formats • Up to 50
                images
              </p>

              <div className="upload-buttons">
                <button
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiFile size={20} />
                  Select Images
                </button>

                <button
                  className="upload-button folder"
                  onClick={() => folderInputRef.current?.click()}
                >
                  <FiFolder size={20} />
                  Select Folder
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

          <div className="controls-section">
            <div className="intensity-control">
              <label className="intensity-label">
                <FiSettings size={20} />
                Cropping Intensity:
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
        <>
          {/* Controls */}
          <div className="upload-section">
            <div className="controls-section">
              <div className="intensity-control">
                <label className="intensity-label">
                  <FiSettings size={20} />
                  Cropping Intensity:
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

              <div className="process-buttons">
                <button
                  onClick={handleSubmit}
                  disabled={images.length === 0 || loading || batchLoading}
                  className="process-button primary"
                >
                  {loading ? (
                    <>
                      <FiLoader size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiEye size={20} />
                      Process Current
                    </>
                  )}
                </button>

                <button
                  onClick={handleBatchSubmit}
                  disabled={images.length === 0 || batchLoading}
                  className="process-button secondary"
                >
                  {batchLoading ? (
                    <>
                      <FiLoader size={20} />
                      {batchProgress.current}/{batchProgress.total}
                    </>
                  ) : (
                    <>
                      <FiGrid size={20} />
                      Process All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* <div className="batch-stats">
                    <div className="stat-card">
                      <div className="stat-number">{images.length}</div>
                      <div className="stat-label">Total Images</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{completedImages}</div>
                      <div className="stat-label">Processed</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{totalCrops}</div>
                      <div className="stat-label">Crops Detected</div>
                    </div>
                  </div> */}

          {/* Gallery Controls */}
          <div className="gallery-controls">
            <div className="gallery-header">
              <div className="gallery-title">
                <FiGrid size={24} />
                Image Gallery ({images.length})
              </div>

              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  className={`view-toggle-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <FiList size={18} />
                </button>
              </div>

              <div className="gallery-actions">
                {totalCrops > 0 && (
                  <button
                    onClick={downloadBatchCrops}
                    className="action-button download-all-button"
                  >
                    <FiDownload size={16} />
                    Download All ({totalCrops})
                  </button>
                )}
                <button
                  onClick={clearImages}
                  className="action-button clear-button"
                >
                  <FiTrash2 size={16} />
                  Clear
                </button>
              </div>
            </div>

            <div className={`image-gallery ${viewMode}`}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`gallery-item ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setCrops(image.crops || []);
                  }}
                >
                  <div className="item-thumbnail">
                    <img src={image.preview} alt={`Thumbnail ${index}`} />
                    {image.processed && (
                      <div className="processed-badge">
                        <FiCheck size={12} />
                      </div>
                    )}
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                  <div className="item-info">
                    <span className="filename">{image.file.name}</span>
                    {image.crops?.length > 0 && (
                      <span className="crop-count">
                        {image.crops.length} crops
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Image Preview */}
          {/* {images.length > 0 && (
                    <div className="current-image-section">
                      <div className="image-header">
                        <div className="image-nav">
                          <button
                            className="nav-button"
                            onClick={() =>
                              setCurrentImageIndex((prev) => {
                                const newIndex = Math.max(0, prev - 1);
                                setCrops(images[newIndex]?.crops || []);
                                return newIndex;
                              })
                            }
                            disabled={currentImageIndex === 0}
                          >
                            <FiChevronLeft size={24} />
                          </button>
                          <h3 className="current-filename">
                            {images[currentImageIndex]?.file.name}
                          </h3>
                          <button
                            className="nav-button"
                            onClick={() =>
                              setCurrentImageIndex((prev) => {
                                const newIndex = Math.min(images.length - 1, prev + 1);
                                setCrops(images[newIndex]?.crops || []);
                                return newIndex;
                              })
                            }
                            disabled={currentImageIndex === images.length - 1}
                          >
                            <FiChevronRight size={24} />
                          </button>
                        </div>
        
                        <div className="gallery-actions">
                          {crops.length > 0 && (
                            <button
                              onClick={downloadAllCrops}
                              className="action-button download-all-button"
                            >
                              <FiDownload size={16} />
                              Download Current ({crops.length})
                            </button>
                          )}
                        </div>
                      </div>
        
                      <div className="current-image-container">
                        <img
                          src={images[currentImageIndex]?.preview}
                          alt="Current Preview"
                          className="current-image"
                        />
                      </div>
        
                      <div className="image-info">
                        <span>
                          <strong>{images[currentImageIndex]?.file.name}</strong>
                        </span>
                        <span>
                          {formatFileSize(images[currentImageIndex]?.file.size || 0)}
                        </span>
                      </div>
                    </div>
                  )} */}

          {/* Crops Section */}
          {crops.length > 0 && (
            <div className="crops-section">
              <div className="crops-header">
                <div className="crops-title">
                  <FiGrid size={24} />
                  Detected Crops ({crops.length})
                </div>
                <div className="method-tag">
                  {cropIntensity.charAt(0).toUpperCase() +
                    cropIntensity.slice(1)}
                </div>
              </div>

              <div className="crops-grid">
                {crops.map((crop, i) => (
                  <div key={i} className="crop-card">
                    <div className="crop-image-container">
                      <img
                        src={`${API_BASE_URL}/${crop}`}
                        alt={`Crop ${i + 1}`}
                        className="crop-image"
                      />
                      <div className="crop-overlay">
                        <button
                          className="download-btn"
                          onClick={() => downloadCrop(crop, i)}
                          title="Download crop"
                        >
                          <FiDownload size={16} />
                          Download
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
        </>
      )}

      {(loading || batchLoading) && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {batchLoading ? "Processing Batch..." : "Processing Image..."}
            </div>
            <div className="loading-subtext">
              {batchLoading
                ? `${batchProgress.current} of ${batchProgress.total} images processed`
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
    </>
  );
}
export default UploadImage;
