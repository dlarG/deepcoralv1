import React, { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  FiUpload,
  FiSettings,
  FiDownload,
  FiEye,
  FiLoader,
  FiX,
  FiCheck,
  FiClock,
  FiFolder,
  FiGrid,
  FiList,
  FiImage,
  FiCheckCircle,
  FiAlertTriangle,
  FiFile,
  FiTrash2,
} from "react-icons/fi";
import "../styles/uploadImage.css";

function UploadImage() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cropIntensity, setCropIntensity] = useState("conservative");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const isGuest = user?.roletype?.toLowerCase() === "guest";

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
      status: "ready", // ready, uploading, uploaded, failed
      quadrats: 0,
      confidence: 0,
      previewCrops: [],
    }));

    setImages((prev) => [...prev, ...newImages]);
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

  const handleGuestUpload = async () => {
    if (images.length === 0) {
      alert("Please select images first!");
      return;
    }

    setLoading(true);

    try {
      const csrfResponse = await fetch(
        `http://${process.env.REACT_APP_API_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const csrfData = await csrfResponse.json();

      const formData = new FormData();

      // Add all images to FormData
      images.forEach((image, index) => {
        formData.append("images", image.file);
      });

      formData.append("intensity", cropIntensity);
      formData.append("csrf_token", csrfData.csrf_token);

      const res = await fetch(
        `http://${process.env.REACT_APP_API_URL}/guest_upload_only`,
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
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Show upload status modal
      setUploadStatus({
        totalImages: data.upload_statistics.total_images_submitted,
        successfulImages: data.upload_statistics.successfully_uploaded,
        rejectedImages: data.upload_statistics.rejected_images,
        uploadedImages: data.uploaded_images,
        rejectedDetails: data.rejected_images,
      });
      setShowStatusModal(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const UploadStatusModal = ({ isOpen, onClose, uploadStatus }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="upload-status-modal">
          <div className="modal-header">
            <h3>Upload Complete!</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>
          <div className="modal-content">
            <div className="status-icon success">
              <FiCheck size={40} />
            </div>

            <div className="upload-summary">
              <h4>Upload Summary</h4>
              <div className="summary-stats">
                <div className="up-stat-items success">
                  <FiCheckCircle size={20} />
                  <span>
                    {uploadStatus.successfulImages} Images Successfully
                    Processed
                  </span>
                </div>
                <div className="up-stat-items info">
                  <FiImage size={20} />
                  <span>
                    {uploadStatus.uploadedImages.reduce(
                      (total, img) => total + img.crops.length,
                      0
                    )}{" "}
                    Quadrat Crops Created
                  </span>
                </div>
                {uploadStatus.rejectedImages > 0 && (
                  <div className="stat-item error">
                    <FiAlertTriangle size={20} />
                    <span>{uploadStatus.rejectedImages} Images Rejected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Show cropped quadrats preview */}
            {/* {uploadStatus.uploadedImages.length > 0 && (
              <div className="cropped-preview">
                <h5>Cropped Quadrats Created:</h5>
                <div className="crops-preview-grid">
                  {uploadStatus.uploadedImages
                    .slice(0, 3)
                    .map((image, imgIndex) => (
                      <div key={imgIndex} className="image-crops-preview">
                        <h6>{image.original_filename}</h6>
                        <div className="crops-row">
                          {image.crops.slice(0, 3).map((crop, cropIndex) => (
                            <div key={cropIndex} className="crop-preview-item">
                              <img
                                src={`http://${process.env.REACT_APP_API_URL}/${crop.crop_url}`}
                                alt={`${crop.quadrat_type} ${crop.quadrat_number}`}
                                className="crop-thumbnail"
                              />
                              <div className="crop-info">
                                <span className="crop-type">
                                  {crop.quadrat_type}
                                </span>
                                <span className="crop-confidence">
                                  {(crop.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                          {image.crops.length > 3 && (
                            <div className="more-crops">
                              +{image.crops.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )} */}

            {uploadStatus.successfulImages > 0 && (
              <div className="status-details">
                <h5>Your cropped quadrats are now pending review</h5>
                <div className="detail-item">
                  <FiClock size={16} />
                  <span>Review typically takes 24-48 hours</span>
                </div>
                <div className="detail-item">
                  <FiEye size={16} />
                  <span>You'll be notified once reviewed</span>
                </div>
                <div className="detail-item">
                  <FiCheck size={16} />
                  <span>
                    Approved quadrats will be ready for coral analysis
                  </span>
                </div>
              </div>
            )}

            {uploadStatus.rejectedDetails &&
              uploadStatus.rejectedDetails.length > 0 && (
                <div className="rejected-details">
                  <h5>Rejected Images:</h5>
                  <div className="rejected-list">
                    {uploadStatus.rejectedDetails.map((rejected, index) => (
                      <div key={index} className="rejected-item">
                        <FiX size={16} />
                        <span>
                          {rejected.filename}: {rejected.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <div className="modal-footer">
            <button className="primary-btn" onClick={onClose}>
              <FiCheck size={16} />
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
        <>
          {/* Upload Instructions */}
          <div className="upload-instructions">
            <h4>What happens next?</h4>
            <div className="instruction-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Upload & Validation</h5>
                  <p>
                    Your images are uploaded and automatically validated for
                    coral quadrats
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Expert Review</h5>
                  <p>
                    Coral experts review your images for quality and content
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Analysis Ready</h5>
                  <p>
                    Approved images become available for coral coverage analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="upload-actions">
              <button
                onClick={handleGuestUpload}
                disabled={images.length === 0 || loading}
                className="upload-btn primary"
              >
                {loading ? (
                  <>
                    <FiLoader size={20} className="spinning" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={20} />
                    Upload for Review
                  </>
                )}
              </button>

              <button onClick={clearImages} className="clear-btn secondary">
                <FiTrash2 size={20} />
                Clear All
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="gallery-section">
            <div className="gallery-header">
              <div className="gallery-title">
                <FiImage size={24} />
                Selected Images ({images.length})
              </div>
            </div>

            <div className="image-gallery guest-gallery">
              {images.map((image, index) => (
                <div key={index} className="gallery-item guest-item">
                  <div className="item-thumbnail">
                    <img src={image.preview} alt={`Thumbnail ${index}`} />
                  </div>
                  <div className="item-info">
                    <span className="filename">{image.file.name}</span>
                    <span className="file-size">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Uploading your images...</div>
            <div className="loading-subtext">
              Please wait while we validate and upload your coral images
            </div>
          </div>
        </div>
      )}

      <UploadStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          clearImages(); // Clear images after showing status
        }}
        uploadStatus={uploadStatus}
      />
    </>
  );
}
export default UploadImage;
