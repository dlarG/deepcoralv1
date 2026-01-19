import React, { useState, useEffect, useRef } from "react";
import { FiDownload, FiInfo, FiLayers } from "react-icons/fi";

function InteractiveCoralAnalysis({
  segmentationData,
  cropIntensity,
  currentImageIndex,
  onDownloadCrop,
  onDownloadOverlay,
  onDownloadMask,
}) {
  const [hoveredClass, setHoveredClass] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [maskOpacity, setMaskOpacity] = useState(0.4); // Adjustable mask opacity
  const [showMaskLayer, setShowMaskLayer] = useState(true);
  const overlayRef = useRef(null);
  const maskRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const originalImageRef = useRef(null);

  // Color map from your backend - exact same colors
  const COLOR_MAP = {
    0: [0, 0, 0], // Background - Black (#000000)
    1: [255, 107, 107], // Acropora-branching - #FF6B6B
    2: [255, 209, 102], // Acropora-tabulate - #FFD166
    3: [76, 205, 196], // Encrusting - #4ECDC4
    4: [17, 138, 178], // Foliose - #118AB2
    5: [7, 59, 76], // Massive - #073B4C
    6: [239, 71, 111], // Mushroom - #EF476F
    7: [114, 9, 183], // Non-acropora-branching - #7209B7
    8: [247, 37, 133], // Submassive - #F72585
  };

  // Class names mapping (from your backend)
  const CORAL_CLASSES = {
    1: "acropora-branching",
    2: "acropora-tabulate",
    3: "encrusting",
    4: "foliose",
    5: "massive",
    6: "mushroom",
    7: "non-acropora-branching",
    8: "submassive",
  };

  // Load and process the MASK image for accurate pixel detection
  const loadMaskImageData = async (maskUrl) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = maskCanvasRef.current;
          if (!canvas) {
            resolve(null);
            return;
          }

          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the MASK image to extract clean pixel data
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          console.log("✅ Loaded MASK image data:", {
            width: canvas.width,
            height: canvas.height,
            totalPixels: imageData.data.length / 4,
          });

          setIsLoading(false);
          resolve(imageData);
        } catch (error) {
          console.error("❌ Error processing mask image:", error);
          setIsLoading(false);
          resolve(null);
        }
      };

      img.onerror = () => {
        console.error("❌ Failed to load mask image");
        setIsLoading(false);
        resolve(null);
      };

      // Use the mask URL instead of overlay URL for pixel detection
      img.src = `${
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      }/${maskUrl}`;
    });
  };

  // Enhanced pixel-based coral class detection using MASK data
  const detectCoralClassAtPixel = (x, y, maskImageData, coverageData) => {
    if (!maskImageData || !coverageData) return null;

    const canvas = maskCanvasRef.current;
    if (!canvas) return null;

    // Ensure coordinates are within bounds
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return null;
    }

    // Get pixel data at the position from MASK image
    const pixelIndex = (y * canvas.width + x) * 4;
    const r = maskImageData.data[pixelIndex];
    const g = maskImageData.data[pixelIndex + 1];
    const b = maskImageData.data[pixelIndex + 2];
    const a = maskImageData.data[pixelIndex + 3];

    // Skip transparent pixels (background)
    if (a === 0 || (r === 0 && g === 0 && b === 0)) {
      return null;
    }

    console.log(`🎯 Mask Pixel at (${x}, ${y}): RGB(${r}, ${g}, ${b}, ${a})`);

    // Find EXACT matching color from our COLOR_MAP (mask has cleaner colors)
    let bestMatch = null;
    let minDistance = Infinity;

    for (const [classId, expectedRGB] of Object.entries(COLOR_MAP)) {
      const classIdNum = parseInt(classId);

      // Skip background (class 0)
      if (classIdNum === 0) continue;

      const [expectedR, expectedG, expectedB] = expectedRGB;

      // Calculate Euclidean distance in RGB space
      const distance = Math.sqrt(
        Math.pow(r - expectedR, 2) +
          Math.pow(g - expectedG, 2) +
          Math.pow(b - expectedB, 2)
      );

      console.log(
        `   Checking class ${classIdNum} (${
          CORAL_CLASSES[classIdNum]
        }): expected RGB(${expectedR}, ${expectedG}, ${expectedB}), distance: ${distance.toFixed(
          2
        )}`
      );

      // Use tighter threshold for mask (cleaner colors)
      if (distance < minDistance && distance < 15) {
        // Reduced threshold for mask accuracy
        minDistance = distance;
        bestMatch = {
          classId: classIdNum,
          className: CORAL_CLASSES[classIdNum],
          distance: distance,
          expectedColor: expectedRGB,
          actualColor: [r, g, b],
        };
      }
    }

    if (bestMatch) {
      console.log(
        `✅ Mask Best match: ${
          bestMatch.className
        } (distance: ${bestMatch.distance.toFixed(2)})`
      );

      // Verify the class exists in coverage data
      const coralData = coverageData.find(
        (coral) => coral.class_name === bestMatch.className
      );
      if (coralData) {
        return bestMatch.className;
      } else {
        console.log(
          `⚠️ Class ${bestMatch.className} not found in coverage data`
        );
      }
    } else {
      console.log(
        `❌ No matching class found in mask for RGB(${r}, ${g}, ${b})`
      );
    }

    return null;
  };

  // Handle mouse movement over the layered images
  const handleLayeredMouseMove = async (event, cropData) => {
    const maskElement = maskRef.current;
    const canvas = maskCanvasRef.current;

    if (!maskElement || !canvas || !cropData.coverage_data) return;

    const rect = maskElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert display coordinates to image coordinates
    const scaleX = canvas.width / maskElement.clientWidth;
    const scaleY = canvas.height / maskElement.clientHeight;
    const imageX = Math.floor(x * scaleX);
    const imageY = Math.floor(y * scaleY);

    setMousePosition({ x: imageX, y: imageY });

    // Get the current MASK image data
    const ctx = canvas.getContext("2d");
    const maskImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Detect coral class at pixel using MASK data
    const detectedClass = detectCoralClassAtPixel(
      imageX,
      imageY,
      maskImageData,
      cropData.coverage_data
    );

    if (detectedClass !== hoveredClass) {
      setHoveredClass(detectedClass);
    }
  };

  const handleLayeredMouseLeave = () => {
    setHoveredClass(null);
    setMousePosition({ x: 0, y: 0 });
  };

  if (!segmentationData?.crops) {
    return (
      <div className="interactive-analysis-results">
        <p>No analysis data available for this image.</p>
      </div>
    );
  }

  const isManuallyIncluded = segmentationData.manually_included;

  return (
    <div className="interactive-analysis-results">
      {segmentationData.crops.map((cropData, cropIndex) => {
        const isLowConfidence =
          cropData.confidence && cropData.confidence < 0.87;
        const isManualOverride =
          cropData.manually_included || cropData.below_threshold;

        return (
          <div key={cropIndex} className="interactive-quadrat-card">
            <div className="quadrat-header">
              <h4>
                Quadrat {cropIndex + 1} - {cropData.detection_label}
                {isManualOverride && (
                  <span className="manual-override-indicator">
                    {isLowConfidence
                      ? ` (Manual Override - ${(
                          cropData.confidence * 100
                        ).toFixed(1)}% confidence)`
                      : " (Manual Override)"}
                  </span>
                )}
              </h4>
              <div className="quadrat-actions">
                <button
                  className="download-btn small"
                  onClick={() => onDownloadCrop(cropData.crop_url, cropIndex)}
                >
                  <FiDownload size={12} />
                  Crop
                </button>
                <button
                  className="download-btn small"
                  onClick={() =>
                    onDownloadOverlay(
                      cropData.overlay_url || cropData.visualization_url,
                      cropIndex
                    )
                  }
                >
                  <FiDownload size={12} />
                  Overlay
                </button>
                {cropData.mask_url && (
                  <button
                    className="download-btn small"
                    onClick={() => onDownloadMask(cropData.mask_url, cropIndex)}
                  >
                    <FiDownload size={12} />
                    Mask
                  </button>
                )}
              </div>
            </div>

            <div className="interactive-content">
              <div className="interactive-overlay-section">
                {/* Layer Controls */}
                <div className="layer-controls">
                  <div className="control-group">
                    <label className="control-label">
                      <FiLayers size={14} />
                      Mask Layer
                    </label>
                    <div className="control-items">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={showMaskLayer}
                          onChange={(e) => setShowMaskLayer(e.target.checked)}
                        />
                        Show Mask
                      </label>
                      <div className="opacity-control">
                        <label>Opacity: {Math.round(maskOpacity * 100)}%</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={maskOpacity}
                          onChange={(e) =>
                            setMaskOpacity(parseFloat(e.target.value))
                          }
                          disabled={!showMaskLayer}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overlay-container">
                  <div className="image-comparison">
                    {/* Original Crop */}
                    <div className="image-panel">
                      <img
                        ref={originalImageRef}
                        src={`${
                          process.env.REACT_APP_API_URL ||
                          "http://localhost:5000"
                        }/${cropData.crop_url}`}
                        alt={`Crop ${cropIndex + 1}`}
                        className="analysis-image original"
                      />
                      <span className="image-label">Original</span>
                    </div>

                    {/* Layered Interactive Overlay + Mask */}
                    <div className="image-panel interactive layered">
                      <div className="layered-wrapper">
                        {/* Bottom Layer: Overlay Image */}
                        <img
                          ref={overlayRef}
                          src={`${
                            process.env.REACT_APP_API_URL ||
                            "http://localhost:5000"
                          }/${
                            cropData.overlay_url || cropData.visualization_url
                          }`}
                          alt={`Overlay ${cropIndex + 1}`}
                          className="analysis-image overlay-layer"
                        />

                        {/* Top Layer: Interactive Mask */}
                        {cropData.mask_url && (
                          <img
                            ref={maskRef}
                            src={`${
                              process.env.REACT_APP_API_URL ||
                              "http://localhost:5000"
                            }/${cropData.mask_url}`}
                            alt={`Interactive Mask ${cropIndex + 1}`}
                            className="analysis-image mask-layer"
                            style={{
                              opacity: showMaskLayer ? maskOpacity : 0,
                              pointerEvents: showMaskLayer ? "auto" : "none",
                            }}
                            onMouseMove={(e) =>
                              handleLayeredMouseMove(e, cropData)
                            }
                            onMouseLeave={handleLayeredMouseLeave}
                            onLoad={() => {
                              // Load mask data when image loads
                              if (cropData.mask_url) {
                                loadMaskImageData(cropData.mask_url);
                              }
                            }}
                          />
                        )}

                        {/* Hidden canvas for pixel data extraction */}
                        <canvas
                          ref={maskCanvasRef}
                          style={{ display: "none" }}
                        />

                        {/* Enhanced hover indicator */}
                        {hoveredClass && (
                          <div className="layered-hover-indicator">
                            <div
                              className="hover-class-badge enhanced"
                              style={{
                                backgroundColor: getCoralColor(
                                  hoveredClass,
                                  cropData.coverage_data
                                ),
                                borderColor: getCoralColor(
                                  hoveredClass,
                                  cropData.coverage_data
                                ),
                              }}
                            >
                              <div className="hover-header">
                                <FiLayers size={12} />
                                <span className="detection-method">
                                  Mask Detection
                                </span>
                              </div>
                              <div className="hover-class-info">
                                <span className="hover-class-name">
                                  {hoveredClass}
                                </span>
                              </div>
                              <div className="pixel-position">
                                Pixel: ({mousePosition.x}, {mousePosition.y})
                              </div>
                            </div>
                          </div>
                        )}

                        {isLoading && (
                          <div className="loading-overlay">
                            <div className="loading-spinner">
                              Loading mask data...
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="image-label">
                        Layered Analysis (Overlay + Mask)
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Class Information Panel */}
                  <div className="class-info-panel enhanced">
                    <div className="panel-header">
                      <h5>
                        <FiInfo size={16} /> Coral Classes Detected
                      </h5>
                      <span className="detection-info">
                        Hover over the mask layer for precise identification
                      </span>
                    </div>

                    {cropData.coverage_data &&
                    cropData.coverage_data.length > 0 ? (
                      <div className="class-info-list">
                        {cropData.coverage_data
                          .sort(
                            (a, b) => b.coverage_percent - a.coverage_percent
                          )
                          .map((coral, coralIndex) => {
                            const isHovered = hoveredClass === coral.class_name;

                            return (
                              <div
                                key={coralIndex}
                                className={`coral-info-item enhanced ${
                                  isHovered ? "highlighted" : ""
                                }`}
                              >
                                <div className="coral-info-header">
                                  <div className="coral-identity">
                                    <div
                                      className="coral-color-indicator enhanced"
                                      style={{ backgroundColor: coral.color }}
                                    ></div>
                                    <div className="coral-details">
                                      <span className="coral-name">
                                        {coral.class_name}
                                      </span>
                                      <span className="coral-category">
                                        {coral.category}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="coverage-info">
                                    <span className="coverage-percentage">
                                      {coral.coverage_percent}%
                                    </span>
                                  </div>
                                </div>

                                <div className="coverage-bar-container">
                                  <div className="coverage-bar">
                                    <div
                                      className="coverage-fill"
                                      style={{
                                        width: `${coral.coverage_percent}%`,
                                        backgroundColor: coral.color,
                                        opacity: isHovered ? 1 : 0.8,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {isHovered && (
                                  <div className="hover-detection-info enhanced">
                                    <FiLayers size={12} />
                                    Detected via mask layer
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="no-coverage-found">
                        <p>ℹ️ No coral coverage detected in this quadrat.</p>
                      </div>
                    )}

                    {/* NEW: Total Coverage Summary for each quadrat */}
                    {cropData.coverage_data &&
                      cropData.coverage_data.length > 0 && (
                        <div className="quadrat-total-coverage">
                          <div className="total-coverage-header">
                            <h6>📊 Quadrat Coverage Summary</h6>
                          </div>

                          <div className="total-coverage-stats">
                            <div className="total-stat-item primary">
                              <span className="stat-label">
                                Total Coral Coverage:
                              </span>
                              <span className="stat-value">
                                {cropData.coverage_data
                                  .reduce(
                                    (sum, coral) =>
                                      sum + coral.coverage_percent,
                                    0
                                  )
                                  .toFixed(1)}
                                %
                              </span>
                            </div>

                            <div className="total-stat-item">
                              <span className="stat-label">
                                Coral Classes Found:
                              </span>
                              <span className="stat-value">
                                {cropData.coverage_data.length}
                              </span>
                            </div>

                            <div className="total-stat-item">
                              <span className="stat-label">
                                Background Coverage:
                              </span>
                              <span className="stat-value">
                                {(
                                  100 -
                                  cropData.coverage_data.reduce(
                                    (sum, coral) =>
                                      sum + coral.coverage_percent,
                                    0
                                  )
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </div>

                          {/* Dominant Species Information */}
                          {cropData.coverage_data.length > 0 && (
                            <div className="dominant-species">
                              <div className="dominant-header">
                                <span className="dominant-label">
                                  Dominant Species:
                                </span>
                                <div className="dominant-info">
                                  <div
                                    className="dominant-color"
                                    style={{
                                      backgroundColor:
                                        cropData.coverage_data[0].color,
                                    }}
                                  ></div>
                                  <span className="dominant-name">
                                    {cropData.coverage_data[0].class_name}
                                  </span>
                                  <span className="dominant-percentage">
                                    (
                                    {cropData.coverage_data[0].coverage_percent}
                                    %)
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper functions remain the same
const getCoralColor = (className, coverageData) => {
  const coral = coverageData?.find((c) => c.class_name === className);
  return coral?.color || "#666666";
};

const getCoralCoverage = (className, coverageData) => {
  const coral = coverageData?.find((c) => c.class_name === className);
  return coral?.coverage_percent || 0;
};

export default InteractiveCoralAnalysis;
