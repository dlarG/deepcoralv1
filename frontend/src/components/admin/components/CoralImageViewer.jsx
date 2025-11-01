import React, { useState, useEffect, useCallback } from "react";
import {
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiDownload,
} from "react-icons/fi";
import "../styles/ImageViewer.css";

const ImageViewer = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = "Image",
  imageTitle = "",
  downloadFilename = "coral-image",
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Reset image state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
    }
  }, [isOpen, imageSrc]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleRotate();
          break;
        case "0":
          e.preventDefault();
          handleReset();
          break;
        default:
          break;
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.1));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${downloadFilename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="image-viewer-overlay"
      onClick={handleBackdropClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Header Controls */}
      <div className="image-viewer-header">
        <div className="image-viewer-title">
          {imageTitle && <h3>{imageTitle}</h3>}
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
        </div>

        <div className="image-viewer-controls">
          <button
            className="viewer-control-btn"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
          >
            <FiZoomOut size={18} />
          </button>

          <button
            className="viewer-control-btn"
            onClick={handleZoomIn}
            title="Zoom In (+)"
          >
            <FiZoomIn size={18} />
          </button>

          <button
            className="viewer-control-btn"
            onClick={handleRotate}
            title="Rotate (R)"
          >
            <FiRotateCw size={18} />
          </button>

          <button
            className="viewer-control-btn"
            onClick={handleDownload}
            title="Download Image"
          >
            <FiDownload size={18} />
          </button>

          <div className="control-divider"></div>

          <button
            className="viewer-control-btn close-btn"
            onClick={onClose}
            title="Close (Esc)"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="image-viewer-content">
        {isLoading && (
          <div className="image-loading">
            <div className="loading-spinner"></div>
            <p>Loading image...</p>
          </div>
        )}

        <img
          src={imageSrc}
          alt={imageAlt}
          className={`viewer-image ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onLoad={handleImageLoad}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          draggable={false}
          onError={(e) => {
            e.target.src = "/default-coral.jpg";
            setIsLoading(false);
          }}
        />
      </div>

      {/* Footer with shortcuts */}
      <div className="image-viewer-footer">
        <div className="keyboard-shortcuts">
          <span>Shortcuts: </span>
          <kbd>Esc</kbd> Close •<kbd>+/-</kbd> Zoom •<kbd>R</kbd> Rotate •
          <kbd>0</kbd> Reset •
          <span className="drag-hint">Drag to pan when zoomed</span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
