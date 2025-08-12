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

  const downloadAllCrops = () => {
    if (images.length === 0 || !images[currentImageIndex]?.crops?.length) {
      alert("No crops to download");
      return;
    }

    images[currentImageIndex].crops.forEach((crop, i) => {
      setTimeout(() => {
        downloadCrop(crop, i);
      }, i * 200);
    });
  };

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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalCrops = images.reduce(
    (sum, img) => sum + (img.crops?.length || 0),
    0
  );
  const completedImages = images.filter((img) => img.processed).length;

  return (
    <div className="add-image-container">
      <style>{`
        .add-image-container {
          max-width: 1600px;
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
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .header-section p {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
        }

        .upload-section {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .file-upload-area {
          border: 3px dashed #cbd5e1;
          border-radius: 20px;
          padding: 4rem 3rem;
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
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(14, 165, 233, 0.15);
        }

        .upload-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: white;
        }

        .upload-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .upload-text p {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1.125rem;
        }

        .upload-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .upload-button:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
        }

        .upload-button.folder {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .upload-button.folder:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }

        .hidden-input {
          position: absolute;
          opacity: 0;
          width: 1px;
          height: 1px;
        }

        .controls-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 2rem;
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
          gap: 0.75rem;
          font-size: 1.125rem;
        }

        .intensity-select {
          padding: 1rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          min-width: 200px;
        }

        .intensity-select:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .process-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .process-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 2rem;
          border: none;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          justify-content: center;
        }

        .process-button.primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .process-button.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
        }

        .process-button.secondary {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .process-button.secondary:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4);
        }

        .process-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Gallery and View Toggle */
        .gallery-controls {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .gallery-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .view-toggle {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 0.25rem;
        }

        .view-toggle-btn {
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-toggle-btn.active {
          background: white;
          color: #0ea5e9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .gallery-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 20px;
        }

        .download-all-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          width: 100%;
        }

        .download-all-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-2px);
        }

        .clear-button {
          background: #ef4444;
          color: white;
          width: 45%;
        }

        .clear-button:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        /* Image Gallery */
        .image-gallery {
          display: grid;
          gap: 1.5rem;
        }

        .image-gallery.grid {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        .image-gallery.list {
          grid-template-columns: 1fr;
        }

        .gallery-item {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: #0ea5e9;
        }

        .gallery-item.active {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
        }

        .item-thumbnail {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
          aspect-ratio: 16/9;
        }

        .item-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .gallery-item:hover .item-thumbnail img {
          transform: scale(1.05);
        }

        .processed-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #10b981;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .remove-btn:hover {
          opacity: 1;
          transform: scale(1.1);
          background: #dc2626;
        }

        .item-info {
          text-align: center;
        }

        .filename {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .crop-count {
          font-size: 0.75rem;
          color: #0ea5e9;
          font-weight: 600;
          background: rgba(14, 165, 233, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          display: inline-block;
        }

        /* Current Image Preview */
        .current-image-section {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .image-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .image-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-button {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .nav-button:hover:not(:disabled) {
          border-color: #0ea5e9;
          background: #0ea5e9;
          color: white;
          transform: translateY(-2px);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .current-filename {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .current-image-container {
          position: relative;
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          border: 2px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s ease;
        }

        .current-image-container:hover {
          border-color: #0ea5e9;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .current-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .image-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 0.875rem;
          color: #64748b;
        }

        /* Crops Section */
        .crops-section {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
        }

        .crops-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .crops-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .method-tag {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .crops-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .crop-card {
          background: #f8fafc;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 2px solid #e2e8f0;
          position: relative;
        }

        .crop-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: #0ea5e9;
        }

        .crop-image-container {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .crop-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .crop-card:hover .crop-image {
          transform: scale(1.05);
        }

        .crop-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .crop-card:hover .crop-overlay {
          opacity: 1;
        }

        .download-btn {
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-btn:hover {
          background: #0284c7;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
        }

        .crop-info {
          padding: 1rem;
          text-align: center;
          background: white;
        }

        .crop-label {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.95rem;
        }

        /* Statistics */
        .batch-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: #0ea5e9;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }

        .loading-content {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
          max-width: 400px;
          width: 90%;
          border: 2px solid #e2e8f0;
        }

        .loading-spinner {
          width: 64px;
          height: 64px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #0ea5e9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .loading-subtext {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .progress-bar-container {
          background: #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          height: 8px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #10b981);
          border-radius: 8px;
          transition: width 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .process-buttons {
            justify-content: center;
          }

          .gallery-header {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 768px) {
          .add-image-container {
            padding: 1rem;
          }

          .header-section h1 {
            font-size: 2rem;
          }

          .upload-section,
          .gallery-controls,
          .current-image-section,
          .crops-section {
            padding: 1.5rem;
          }

          .file-upload-area {
            padding: 2rem 1rem;
          }

          .upload-buttons {
            flex-direction: column;
          }

          .image-gallery.grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .crops-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .batch-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .image-gallery.grid {
            grid-template-columns: 1fr;
          }

          .crops-grid {
            grid-template-columns: 1fr;
          }

          .batch-stats {
            grid-template-columns: 1fr;
          }

          .process-buttons {
            flex-direction: column;
          }
        }
      `}</style>

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
                        src={`http://localhost:5000/${crop}`}
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
    </div>
  );
}

export default AddImage;
