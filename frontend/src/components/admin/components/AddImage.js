import React, { useState } from "react";
import {
  FiUpload,
  FiImage,
  FiSettings,
  FiDownload,
  FiEye,
  FiLoader,
  FiX,
  FiCheck,
} from "react-icons/fi";

function AddImage() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cropIntensity, setCropIntensity] = useState("conservative");
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setImage(file);
    setCrops([]); // Clear previous crops

    // Create preview URL for the original image
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);

    try {
      // Get CSRF token first
      const csrfResponse = await fetch("http://localhost:5000/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      const csrfData = await csrfResponse.json();

      const formData = new FormData();
      formData.append("image", image);
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
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    setCrops([]);
  };

  const downloadCrop = (cropUrl, index) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${cropUrl}`;
    link.download = `crop_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="add-image-container">
      <style>{`
        .add-image-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-section h1 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .header-section p {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .upload-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .file-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #f8fafc;
          position: relative;
          cursor: pointer;
        }

        .file-upload-area:hover,
        .file-upload-area.drag-active {
          border-color: #0ea5e9;
          background: #eff6ff;
          transform: translateY(-2px);
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .upload-text h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }

        .upload-text p {
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
          transform: translateY(-2px);
        }

        .controls-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .intensity-control {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .intensity-label {
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .intensity-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .intensity-select:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .process-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          justify-content: center;
        }

        .process-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .process-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .image-preview-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .preview-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .clear-button {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .clear-button:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .image-container {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .original-image {
          width: 100%;
          max-height: 500px;
          object-fit: contain;
          background: #f8fafc;
        }

        .crops-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .crops-header {
          margin-bottom: 2rem;
        }

        .crops-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .crops-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }

        .stat-item {
          padding: 0.75rem 1.25rem;
          background: #f1f5f9;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .crops-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .crop-item {
          background: #f8fafc;
          border-radius: 16px;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .crop-item:hover {
          border-color: #0ea5e9;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .crop-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1rem;
          background: white;
        }

        .crop-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .crop-label {
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .download-btn {
          padding: 0.5rem;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .download-btn:hover {
          background: #0284c7;
          transform: scale(1.1);
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-content {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #0ea5e9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
        }

        @media (max-width: 768px) {
          .add-image-container {
            padding: 1rem;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .crops-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }

          .crops-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="upload-section">
        <div
          className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleUpload}
            accept="image/*"
            className="file-input"
            id="file-input"
          />

          <div className="upload-icon">
            <FiUpload size={32} />
          </div>

          <div className="upload-text">
            <h3>Drag & drop your image here</h3>
            <p>or click to browse files • Supports JPG, PNG, WEBP</p>
            <label htmlFor="file-input" className="upload-button">
              <FiImage size={18} />
              Choose Image
            </label>
          </div>
        </div>

        <div className="controls-section">
          <div className="intensity-control">
            <label className="intensity-label">
              <FiSettings size={18} />
              Cropping Intensity:
            </label>
            <select
              value={cropIntensity}
              onChange={(e) => setCropIntensity(e.target.value)}
              className="intensity-select"
            >
              <option value="conservative">Conservative (reccomended)</option>
              <option value="moderate">Moderate (12% crop)</option>
              <option value="aggressive">Aggressive (18% crop)</option>
              <option value="smart">Smart (Edge Detection)</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="process-button"
          >
            {loading ? (
              <>
                <FiLoader className="loading-spinner" size={20} />
                Processing...
              </>
            ) : (
              <>
                <FiEye size={20} />
                Crop & Result
              </>
            )}
          </button>
        </div>
      </div>

      {imagePreview && (
        <div className="image-preview-section">
          <div className="preview-header">
            <h2>
              <FiImage size={24} />
              Original Image
            </h2>
            <button onClick={clearImage} className="clear-button">
              <FiX size={16} />
              Clear
            </button>
          </div>

          <div className="image-container">
            <img src={imagePreview} alt="Original" className="original-image" />
          </div>
        </div>
      )}

      {crops.length > 0 && (
        <div className="crops-section">
          <div className="crops-header">
            <h2>Detected Crops</h2>
            <div className="crops-stats">
              <div className="stat-item">
                <FiCheck
                  size={16}
                  style={{ display: "inline", marginRight: "0.5rem" }}
                />
                {crops.length} crops detected
              </div>
              <div className="stat-item">
                Method:{" "}
                {cropIntensity.charAt(0).toUpperCase() + cropIntensity.slice(1)}
              </div>
            </div>
          </div>

          <div className="crops-grid">
            {crops.map((crop, i) => (
              <div key={i} className="crop-item">
                <img
                  src={`http://localhost:5000/${crop}`}
                  alt={`Crop ${i + 1}`}
                  className="crop-image"
                />
                <div className="crop-info">
                  <p className="crop-label">Crop {i + 1}</p>
                  <button
                    className="download-btn"
                    onClick={() => downloadCrop(crop, i)}
                    title="Download crop"
                  >
                    <FiDownload size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Processing your image...</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddImage;
