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
  FiEye,
  FiEyeOff,
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
import LocationSelector from "../../admin/components/LocationSelector";

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
  const [validationCompleted, setValidationCompleted] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [validationProgress, setValidationProgress] = useState({
    current: 0,
    total: 0,
  });
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
  const [showInvalidImages, setShowInvalidImages] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const { user } = useAuth();

  // New GIS and validation states
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [processedImagesForSaving, setProcessedImagesForSaving] = useState([]);
  const [rejectedImages, setRejectedImages] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const [manuallyIncluded, setManuallyIncluded] = useState(new Set());
  const [showManualOverrideModal, setShowManualOverrideModal] = useState(false);
  const [imageToOverride, setImageToOverride] = useState(null);

  const [analysisInProgress, setAnalysisInProgress] = useState(false);

  const processCrops = async (file, intensity) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("intensity", intensity);

      const csrfResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const csrfData = await csrfResponse.json();
      formData.append("csrf_token", csrfData.csrf_token);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/detect_custom`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfData.csrf_token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update current image with segmentation data
        setImages((prev) =>
          prev.map((img, idx) => {
            if (idx === currentImageIndex) {
              return {
                ...img,
                crops: data.crops || [],
                processed: true,
                status: "processed",
                segmentationData: {
                  crops: data.segmentation_data || [],
                  total_crops: data.segmentation_data
                    ? data.segmentation_data.length
                    : 0,
                  filename: img.file.name,
                },
              };
            }
            return img;
          })
        );

        setCrops(data.crops || []);
        return data.crops || [];
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error processing crops:", error);
      throw error;
    }
  };

  const handleManualInclude = (imageIndex) => {
    const image = images[imageIndex];
    setImageToOverride({ index: imageIndex, image });
    setShowManualOverrideModal(true);
  };

  const confirmManualInclude = () => {
    if (imageToOverride) {
      const newManuallyIncluded = new Set(manuallyIncluded);
      newManuallyIncluded.add(imageToOverride.index);
      setManuallyIncluded(newManuallyIncluded);

      console.log("Updated manually included:", newManuallyIncluded); // Debug log

      // Update the image status to manually_included
      setImages((prev) =>
        prev.map((img, idx) => {
          if (idx === imageToOverride.index) {
            console.log("Updating image at index", idx); // Debug log
            return {
              ...img,
              status: "manually_included",
              manualOverride: true,
              originalRejectionReason: img.rejectionReason,
              rejectionReason: null,
            };
          }
          return img;
        })
      );

      setShowManualOverrideModal(false);
      setImageToOverride(null);
    } else {
      console.log("No imageToOverride found!");
    }
  };

  const handleRemoveManualInclude = (imageIndex) => {
    const newManuallyIncluded = new Set(manuallyIncluded);
    newManuallyIncluded.delete(imageIndex);
    setManuallyIncluded(newManuallyIncluded);

    // Revert the image back to invalid status
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === imageIndex
          ? {
              ...img,
              status: "invalid",
              manualOverride: false,
              rejectionReason:
                img.originalRejectionReason || "No coral quadrats detected",
              originalRejectionReason: null,
            }
          : img
      )
    );
  };

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
      status: "pending",
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

    // Reset button states when new images are added
    setValidationCompleted(false);
    setAnalysisCompleted(false);
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

  const downloadSegmentationMask = (maskUrl, index) => {
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API_URL}/${maskUrl}`;
    link.download = `segmentation_${index + 1}_${
      images[currentImageIndex].file.name
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSegmentationOverlay = (overlayUrl, index) => {
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API_URL}/${overlayUrl}`;
    link.download = `coral_overlay_${index + 1}_${
      images[currentImageIndex].file.name
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setCurrentImageIndex(0);
    setCrops([]);
    setRejectedImages([]);
    setManuallyIncluded(new Set());
    setShowSaveButton(false);
    setSavedToDatabase(false);
    setBatchResults(null);
    setShowBatchChart(false);

    // Reset button states
    setValidationCompleted(false);
    setAnalysisCompleted(false);
    setValidationProgress({ current: 0, total: 0 });
    setBatchProgress({ current: 0, total: 0 });
  };

  const removeImage = (index, skipConfirmation = false) => {
    const imageToRemove = images[index];

    // Show confirmation for processed images unless skipped
    if (!skipConfirmation && imageToRemove.processed) {
      setConfirmRemove(index);
      return;
    }

    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);

    setImages(newImages);

    // Update rejected images list if removing from there
    if (imageToRemove.status === "invalid") {
      setRejectedImages((prev) =>
        prev.filter((rejImg) => rejImg.file.name !== imageToRemove.file.name)
      );
    }

    // Adjust current image index
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

    // Clear confirmation
    setConfirmRemove(null);

    // Update processed images for saving if needed
    if (imageToRemove.processed) {
      setProcessedImagesForSaving((prev) =>
        prev.filter((img) => img.file.name !== imageToRemove.file.name)
      );
    }
  };

  // Batch remove invalid images
  const removeAllInvalidImages = () => {
    const invalidCount = images.filter(
      (img) => img.status === "invalid"
    ).length;

    if (invalidCount === 0) return;

    if (
      window.confirm(
        `Are you sure you want to remove all ${invalidCount} invalid images?`
      )
    ) {
      const validImages = images.filter((img) => img.status !== "invalid");

      // Clean up URLs for removed images
      images
        .filter((img) => img.status === "invalid")
        .forEach((img) => {
          URL.revokeObjectURL(img.preview);
        });

      setImages(validImages);
      setRejectedImages([]);
      setCurrentImageIndex(0);

      if (validImages.length === 0) {
        setCrops([]);
        setShowSaveButton(false);
        setSavedToDatabase(false);
      } else {
        setCrops(validImages[0]?.crops || []);
      }
    }
  };

  const downloadCrop = (cropUrl, index) => {
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API_URL}/${cropUrl}`;
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

      const csrfResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const csrfData = await csrfResponse.json();
      formData.append("csrf_token", csrfData.csrf_token);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/detect_custom`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfData.csrf_token,
          },
        }
      );

      // Don't throw error on 400 - handle it gracefully
      if (response.ok) {
        const data = await response.json();

        if (data.crops && data.crops.length > 0) {
          return {
            valid: true,
            quadratCount: data.crops.length,
            confidence: data.highest_confidence,
            totalDetections: data.total_detections,
            validDetections: data.valid_detections,
          };
        } else {
          return {
            valid: false,
            quadratCount: 0,
            reason: "No coral quadrats detected in this image",
            confidenceThreshold: data.confidence_threshold,
            totalDetections: data.total_detections || 0,
          };
        }
      } else if (response.status === 400) {
        // Handle 400 errors gracefully - this is expected for invalid images
        const errorData = await response.json().catch(() => ({}));

        let reason =
          errorData.error || "No coral quadrats detected in this image";

        // Add confidence information if available
        if (
          errorData.confidence_threshold &&
          errorData.quadrat_detections_low_confidence > 0
        ) {
          reason += ` (confidence threshold: ${(
            errorData.confidence_threshold * 100
          ).toFixed(0)}%)`;
        }

        if (errorData.other_detections > 0) {
          reason += `. Found ${errorData.other_detections} other object(s).`;
        }

        return {
          valid: false,
          quadratCount: 0,
          reason: reason,
          confidenceThreshold: errorData.confidence_threshold,
          totalDetections: errorData.total_detections || 0,
        };
      } else {
        // Handle other HTTP errors (500, etc.)
        const errorText = await response.text().catch(() => "Unknown error");
        return {
          valid: false,
          quadratCount: 0,
          reason: `Server error: ${response.status} - ${errorText}`,
        };
      }
    } catch (error) {
      // Handle network errors, parsing errors, etc.
      console.error("Validation network error:", error);
      return {
        valid: false,
        quadratCount: 0,
        reason: "Network error during validation: " + error.message,
      };
    }
  };

  const validateAllImages = async () => {
    if (loading || validationCompleted) return; // Prevent multiple validations

    setLoading(true);
    setValidationProgress({ current: 0, total: images.length });

    const updatedImages = [...images];
    const rejected = [];

    let validatedCount = 0;
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < images.length; i++) {
      if (images[i].processed) continue;

      // Update progress
      setValidationProgress({ current: i + 1, total: images.length });

      updatedImages[i].status = "validating";
      setImages([...updatedImages]);

      const validation = await validateImageForQuadrats(images[i].file);
      validatedCount++;

      if (validation.valid) {
        updatedImages[i].status = "valid";
        updatedImages[i].quadratsDetected = validation.quadratCount;
        updatedImages[i].confidence = validation.confidence;
        updatedImages[i].detectionDetails = {
          totalDetections: validation.totalDetections,
          validDetections: validation.validDetections,
        };
        validCount++;
      } else {
        updatedImages[i].status = "invalid";
        updatedImages[i].rejectionReason = validation.reason;
        updatedImages[i].confidenceThreshold = validation.confidenceThreshold;
        updatedImages[i].detectionDetails = {
          totalDetections: validation.totalDetections,
        };
        rejected.push({
          ...images[i],
          rejectionReason: validation.reason,
        });
        invalidCount++;
      }

      setImages([...updatedImages]);
    }

    setRejectedImages(rejected);
    setLoading(false);
    setValidationCompleted(true); // Mark validation as completed
    setValidationProgress({ current: 0, total: 0 });

    const validationSummary =
      `Validation complete:\n` +
      `${validCount} images valid with quadrats\n` +
      `${invalidCount} images rejected\n\n` +
      `Confidence threshold: 87% minimum`;
    alert(validationSummary);
  };

  const downloadBatchCrops = () => {
    let totalCrops = 0;
    images.forEach((image, imgIndex) => {
      if (image.crops && image.crops.length > 0) {
        image.crops.forEach((crop, cropIndex) => {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = `${process.env.REACT_APP_API_URL}/${crop}`;
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

    // Prevent multiple clicks and check if analysis already completed
    if (analysisInProgress || analysisCompleted) {
      if (analysisCompleted) {
        alert("Analysis already completed! Clear images to analyze new ones.");
      } else {
        alert("Analysis already in progress!");
      }
      return;
    }

    // Get valid images AND manually included images
    const validImages = images.filter(
      (img) =>
        img.status === "valid" ||
        img.status === "processed" ||
        img.status === "manually_included" ||
        (img.status === "pending" && img.processed !== false)
    );

    // FIXED: Calculate manually_included_indices based on the validImages array indices
    const manuallyIncludedIndices = [];
    validImages.forEach((img, validIndex) => {
      if (img.status === "manually_included") {
        manuallyIncludedIndices.push(validIndex); // Use validIndex, not original index
      }
    });

    const invalidCount = images.filter(
      (img) => img.status === "invalid"
    ).length;

    const manuallyIncludedCount = validImages.filter(
      (img) => img.status === "manually_included"
    ).length;

    if (validImages.length === 0) {
      alert(
        "No valid images to process. Please validate your images first or manually include some images."
      );
      return;
    }

    let confirmMessage = `Found ${
      validImages.length - manuallyIncludedCount
    } valid image(s)`;

    if (manuallyIncludedCount > 0) {
      confirmMessage += ` and ${manuallyIncludedCount} manually included image(s)`;
    }

    if (invalidCount > 0) {
      confirmMessage += `. ${invalidCount} invalid image(s) will be skipped.`;
    }

    confirmMessage += ` Proceed with analyzing ${validImages.length} total image(s)?`;

    // Enhanced debug logging
    console.log("=== BATCH ANALYSIS DEBUG ===");
    console.log(
      "All images:",
      images.map((img, idx) => ({
        index: idx,
        filename: img.file.name,
        status: img.status,
      }))
    );
    console.log(
      "Valid images:",
      validImages.map((img, idx) => ({
        validIndex: idx,
        filename: img.file.name,
        status: img.status,
      }))
    );
    console.log(
      "Manually included indices (in validImages array):",
      manuallyIncludedIndices
    );
    console.log("Manually included count:", manuallyIncludedCount);

    if (invalidCount > 0 || manuallyIncludedCount > 0) {
      const proceed = window.confirm(confirmMessage);
      if (!proceed) return;
    }

    // Set analysis in progress - FIXED: Set initial progress to 0
    setAnalysisInProgress(true);
    setBatchLoading(true);
    setShowBatchChart(false);
    setBatchProgress({ current: 0, total: validImages.length });

    try {
      const csrfResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const csrfData = await csrfResponse.json();

      const formData = new FormData();
      validImages.forEach((image, index) => {
        formData.append("images", image.file);
      });
      formData.append("csrf_token", csrfData.csrf_token);
      formData.append("intensity", cropIntensity);
      formData.append(
        "manually_included",
        JSON.stringify(manuallyIncludedIndices)
      );

      // Additional debug info
      formData.append(
        "debug_info",
        JSON.stringify({
          total_valid_images: validImages.length,
          manually_included_count: manuallyIncludedCount,
          manually_included_indices: manuallyIncludedIndices,
          valid_images_filenames: validImages.map((img) => img.file.name),
          manually_included_filenames: validImages
            .filter((img, idx) => manuallyIncludedIndices.includes(idx))
            .map((img) => img.file.name),
        })
      );

      let progressStep = 0;
      const totalSteps = validImages.length;

      const updateProgress = () => {
        setBatchProgress({ current: progressStep, total: totalSteps });
      };

      // ADDED: Progress simulation for better UX while waiting for server response
      const simulateProgress = () => {
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 10; // Random increment between 0-10%
          if (progressStep < totalSteps - 1) {
            progressStep++;
            updateProgress();
          } else {
            clearInterval(progressInterval);
          }
        }, 1000); // Update every 500ms

        return progressInterval;
      };

      const progressInterval = simulateProgress();

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/batch_analyze`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfData.csrf_token,
          },
        }
      );

      // ADDED: Clear the progress simulation once we get response
      clearInterval(progressInterval);

      // ADDED: Set to 100% when complete
      setBatchProgress({ current: totalSteps, total: totalSteps });

      const contentType = res.headers.get("content-type") || "";
      const resBody = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        console.error("batch_analyze failed:", res.status, resBody);
        alert(
          "Batch analyze failed: " +
            (resBody?.error || JSON.stringify(resBody) || res.status)
        );
        return;
      }

      const data = resBody;

      setBatchResults(data);
      setShowBatchChart(true);
      setActiveTab("batch-analysis");
      setShowSaveButton(true);
      setAnalysisCompleted(true);

      // FIXED: Process results with proper manual override handling
      const processedImagesWithData = validImages.map((image) => {
        const result = data.results.find((r) => r.filename === image.file.name);
        if (result && result.crops) {
          return {
            ...image,
            crops: result.crops.map((crop) => crop.crop_url),
            processed: true,
            status: "processed",
            segmentationData: {
              crops: result.crops.map((crop) => ({
                ...crop,
                // Ensure both field names are available for backward compatibility
                overlay_url: crop.overlay_url || crop.visualization_url,
                visualization_url: crop.overlay_url || crop.visualization_url,
                mask_url: crop.mask_url, // Add mask URL
                manually_included: crop.manually_included || false, // Track manual override
              })),
              total_crops: result.crops.length,
              filename: result.filename,
              manually_included: result.manually_included || false,
            },
          };
        }
        return image;
      });

      setProcessedImagesForSaving(processedImagesWithData);

      // FIXED: Update images with results, preserving manual override status
      const updatedImages = images.map((image) => {
        const result = data.results.find((r) => r.filename === image.file.name);
        if (result && result.crops) {
          return {
            ...image,
            crops: result.crops.map((crop) => crop.crop_url),
            processed: true,
            status: "processed",
            segmentationData: {
              crops: result.crops.map((crop) => ({
                ...crop,
                overlay_url: crop.overlay_url || crop.visualization_url,
                visualization_url: crop.overlay_url || crop.visualization_url,
                mask_url: crop.mask_url,
                manually_included: crop.manually_included || false,
              })),
              total_crops: result.crops.length,
              filename: result.filename,
              manually_included: result.manually_included || false,
            },
          };
        }
        return image;
      });

      setImages(updatedImages);

      // Show success message with manual override info
      let successMessage = `Analysis completed successfully!\n`;
      successMessage += `${data.batch_statistics.total_images_processed} images processed\n`;
      successMessage += `${data.batch_statistics.total_crops} total crops generated\n`;

      if (data.batch_statistics.manually_included_count > 0) {
        successMessage += `${data.batch_statistics.manually_included_count} manually overridden images included\n`;
      }

      if (data.batch_statistics.total_images_rejected > 0) {
        successMessage += `${data.batch_statistics.total_images_rejected} images rejected`;
      }

      alert(successMessage);
    } catch (error) {
      console.error("Batch analysis error:", error);
      alert("Batch analysis failed: " + error.message);
    } finally {
      setBatchLoading(false);
      setAnalysisInProgress(false); // Re-enable button
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
  const renderLoadingOverlay = () => {
    if (!loading && !batchLoading) return null;

    const isValidating = loading && validationProgress.total > 0;
    const isAnalyzing = batchLoading && batchProgress.total > 0;

    let progressPercentage = 0;
    let currentStep = 0;
    let totalSteps = 0;
    let statusText = "";
    let subText = "";

    if (isValidating) {
      currentStep = validationProgress.current;
      totalSteps = validationProgress.total;
      progressPercentage =
        totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
      statusText = "Validating Images...";
      subText = `Processing ${currentStep} of ${totalSteps} images`;
    } else if (isAnalyzing) {
      currentStep = batchProgress.current;
      totalSteps = batchProgress.total;
      progressPercentage =
        totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
      statusText = "Analyzing Batch...";
      subText = `Processing ${currentStep} of ${totalSteps} images`;
    } else if (loading) {
      progressPercentage = 50;
      statusText = "Processing Image...";
      subText = "Please wait while we analyze your image";
    } else if (batchLoading) {
      progressPercentage = 50;
      statusText = "Analyzing Batch...";
      subText = "Processing your images...";
    }

    return (
      <div className="loading-overlay">
        <div className="imageupload-loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">{statusText}</div>
          <div className="loading-subtext">{subText}</div>

          {/* Enhanced Progress Bar */}
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Progress Percentage */}
          <div className="progress-percentage">
            {Math.round(progressPercentage)}%
            {totalSteps > 0 && (
              <span className="progress-count">
                {" "}
                ({currentStep}/{totalSteps})
              </span>
            )}
          </div>

          {/* Cancel Button for Long Operations */}
          {(isValidating || isAnalyzing) && (
            <button
              className="cancel-operation-btn"
              onClick={() => {
                // You can implement cancellation logic here if needed
                console.log("Operation cancellation requested");
              }}
            >
              Cancel Operation
            </button>
          )}
        </div>
      </div>
    );
  };
  const renderImageGallery = () => {
    const validImagesCount = images.filter(
      (img) => img.status === "valid" || img.status === "processed"
    ).length;
    const invalidImagesCount = images.filter(
      (img) => img.status === "invalid"
    ).length;
    const pendingImagesCount = images.filter(
      (img) => img.status === "pending"
    ).length;
    const manuallyIncludedCount = images.filter(
      (img) => img.status === "manually_included"
    ).length;

    // Filter images based on showInvalidImages setting
    const displayImages = showInvalidImages
      ? images
      : images.filter((img) => img.status !== "invalid");

    return (
      <div className="gallery-section">
        <div className="gallery-header">
          <div className="gallery-title">
            <FiGrid size={20} />
            <span>Image Gallery ({displayImages.length})</span>
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

            <div className="gallery-filter-actions">
              {invalidImagesCount > 0 && (
                <button
                  className={`filter-btn ${showInvalidImages ? "active" : ""}`}
                  onClick={() => setShowInvalidImages(!showInvalidImages)}
                  title={
                    showInvalidImages
                      ? "Hide invalid images"
                      : "Show invalid images"
                  }
                >
                  {showInvalidImages ? (
                    <FiEye size={14} />
                  ) : (
                    <FiEyeOff size={14} />
                  )}
                  <span>{showInvalidImages ? "Hide" : "Show"} Invalid</span>
                </button>
              )}

              {invalidImagesCount > 0 && (
                <button
                  onClick={removeAllInvalidImages}
                  className="action-button danger-outline"
                  title={`Remove all ${invalidImagesCount} invalid images`}
                >
                  <FiTrash2 size={14} />
                  <span>Remove Invalid ({invalidImagesCount})</span>
                </button>
              )}
            </div>

            <div className="gallery-actions">
              <button onClick={clearImages} className="action-button clear">
                <FiTrash2 size={14} />
                <span className="action-text">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Image Status Summary */}
        <div className="image-status-summary">
          <div className="status-item valid">
            <span className="status-count">{validImagesCount}</span>
            <span className="status-label">Valid</span>
          </div>

          <div className="status-item invalid">
            <span className="status-count">{invalidImagesCount}</span>
            <span className="status-label">Invalid</span>
          </div>

          <div className="status-item pending">
            <span className="status-count">{pendingImagesCount}</span>
            <span className="status-label">Pending</span>
          </div>

          {validImagesCount + manuallyIncludedCount > 0 &&
            invalidImagesCount > 0 && (
              <div className="analysis-info">
                <FiAlertTriangle size={14} />
                <span>
                  {validImagesCount + manuallyIncludedCount} images ready for
                  analysis
                  {manuallyIncludedCount > 0 &&
                    ` (${manuallyIncludedCount} manually included)`}
                </span>
              </div>
            )}
        </div>

        <div className={`image-gallery ${viewMode}`}>
          {displayImages.map((image, index) => {
            const originalIndex = images.findIndex((img) => img === image);
            const isManuallyIncluded = manuallyIncluded.has(originalIndex);

            return (
              <div
                key={originalIndex}
                className={`gallery-item ${
                  originalIndex === currentImageIndex ? "active" : ""
                } ${image.status} ${image.processed ? "processed" : ""} ${
                  isManuallyIncluded ? "manually-included" : ""
                }`}
                onClick={() => {
                  setCurrentImageIndex(originalIndex);
                  const currentCrops = image.crops || [];
                  setCrops(currentCrops);
                }}
              >
                <div className="item-thumbnail">
                  <img src={image.preview} alt={`Thumbnail ${originalIndex}`} />

                  <div className="thumbnail-overlay">
                    {/* Enhanced Status indicator */}
                    <div className={`upload-status-indicator ${image.status}`}>
                      {image.status === "valid" && <FiCheckCircle size={12} />}
                      {image.status === "invalid" && <FiX size={12} />}
                      {image.status === "manually_included" && (
                        <FiCheckCircle size={12} />
                      )}
                      {image.status === "validating" && (
                        <FiLoader size={12} className="spinning" />
                      )}
                      {image.status === "processed" && (
                        <FiCheckCircle size={12} />
                      )}
                    </div>

                    {/* Manual Override Button for Invalid Images */}
                    {image.status === "invalid" && (
                      <button
                        className="manual-include-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManualInclude(originalIndex);
                        }}
                        title="Manually include this image in analysis"
                      >
                        <FiCheckCircle size={12} />
                      </button>
                    )}

                    {/* Remove Manual Override Button */}
                    {image.status === "manually_included" && (
                      <button
                        className="remove-manual-include-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveManualInclude(originalIndex);
                        }}
                        title="Remove manual inclusion"
                      >
                        <FiX size={12} />
                      </button>
                    )}

                    {/* Enhanced Remove button */}
                    <button
                      className={`upload-remove-btn ${image.status}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(originalIndex);
                      }}
                      title={`Remove ${image.status} image`}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="item-info">
                  <span className="filename" title={image.file.name}>
                    {image.file.name}
                  </span>
                  <div className="item-status">
                    {image.status === "valid" && (
                      <span className="quadrat-count valid">
                        ✓ {image.quadratsDetected} quadrat
                        {image.quadratsDetected !== 1 ? "s" : ""} detected
                      </span>
                    )}
                    {image.status === "invalid" && (
                      <div className="invalid-status">
                        <span
                          className="error-text"
                          title={image.rejectionReason}
                        >
                          ✗ No quadrats detected
                        </span>
                        <button
                          className="manual-include-text-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManualInclude(originalIndex);
                          }}
                        >
                          Click to include anyway
                        </button>
                      </div>
                    )}
                    {image.status === "manually_included" && (
                      <div className="manually-included-status">
                        <span className="manually-included-text">
                          ✓ Manually included for analysis
                        </span>
                        <span
                          className="original-reason"
                          title={image.originalRejectionReason}
                        >
                          (Originally: No quadrats detected)
                        </span>
                      </div>
                    )}
                    {image.status === "processed" &&
                      image.crops?.length > 0 && (
                        <span className="crop-count processed">
                          ✓ {image.crops.length} crop
                          {image.crops.length > 1 ? "s" : ""} processed
                        </span>
                      )}
                    {image.status === "validating" && (
                      <span className="validating-text">
                        <FiLoader size={12} className="spinning" />
                        Validating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderConfirmationModal = () => {
    if (confirmRemove === null) return null;

    const imageToRemove = images[confirmRemove];

    return (
      <div className="confirmation-overlay">
        <div className="confirmation-modal">
          <div className="confirmation-header">
            <h3>Confirm Removal</h3>
            <button
              className="close-btn"
              onClick={() => setConfirmRemove(null)}
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="confirmation-content">
            <div className="confirmation-image">
              <img src={imageToRemove.preview} alt="File to remove" />
            </div>

            <div className="confirmation-details">
              <p>
                <strong>File:</strong> {imageToRemove.file.name}
              </p>
              <p>
                <strong>Status:</strong> {imageToRemove.status}
              </p>
              {imageToRemove.processed && (
                <p className="warning-text">
                  <FiAlertTriangle size={14} />
                  This image has been processed. Removing it will also remove
                  its analysis results.
                </p>
              )}
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="btn-cancel"
              onClick={() => setConfirmRemove(null)}
            >
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={() => removeImage(confirmRemove, true)}
            >
              Remove Image
            </button>
          </div>
        </div>
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
          <h3 className="up-title">Batch Analysis Results</h3>
          <div className="upload-batch-stats">
            <div className="upload-stat-card">
              <span className="upload-stat-number">
                {batchResults.batch_statistics.total_crops}
              </span>
              <span className="upload-stat-label">Images Analyzed</span>
            </div>
            <div className="upload-stat-card">
              <span className="upload-stat-number">
                {batchResults.batch_statistics.total_crops}
              </span>
              <span className="upload-stat-label">Quadrats Detected</span>
            </div>
            <div className="upload-stat-card">
              <span className="upload-stat-number">
                {Math.round(
                  batchResults.batch_statistics.coverage_summary.reduce(
                    (sum, coral) => sum + coral.coverage_percent,
                    0
                  )
                )}
                %
              </span>
              <span className="upload-stat-label">Total Coverage</span>
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

        <div className="upload-charts-container">
          <div className="chart-section">
            <h4>Coverage Distribution - Pie Chart</h4>
            <div className="upload-chart-wrapper">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-section">
            <h4>Coverage Distribution - Bar Chart</h4>
            <div className="upload-chart-wrapper">
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
                <div key={index} className="up-table-row">
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

  const totalCrops = images.reduce(
    (sum, img) => sum + (img.crops?.length || 0),
    0
  );
  // const completedImages = images.filter((img) => img.processed).length;

  const renderAnalysisResults = () => {
    const currentImage = images[currentImageIndex];
    if (!currentImage?.segmentationData?.crops) {
      return (
        <div className="image-upload-analysis-results">
          <p>No analysis data available for this image.</p>
        </div>
      );
    }

    const segmentationData = currentImage.segmentationData;
    const isManuallyIncluded =
      segmentationData.manually_included ||
      currentImage.status === "manually_included";

    return (
      <div className="image-upload-analysis-results">
        <div className="analysis-header">
          <h3 className="up-title">Coral Analysis Results</h3>
          <div className="analysis-stats">
            <span className="uploaded-num">
              {segmentationData.total_crops} quadrats analyzed
            </span>
            <span className="method-tag">
              {cropIntensity.charAt(0).toUpperCase() + cropIntensity.slice(1)}
            </span>
            {isManuallyIncluded && (
              <span className="manual-override-badge">
                ⚠️ Manually Included
              </span>
            )}
          </div>
        </div>

        <div className="quadrats-analysis">
          {segmentationData.crops.map((cropData, cropIndex) => {
            const isLowConfidence =
              cropData.confidence && cropData.confidence < 0.87;
            const isManualOverride =
              cropData.manually_included || cropData.below_threshold;

            return (
              <div key={cropIndex} className="quadrat-analysis-card">
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
                      onClick={() => downloadCrop(cropData.crop_url, cropIndex)}
                    >
                      <FiDownload size={12} />
                      Crop
                    </button>
                    <button
                      className="download-btn small"
                      onClick={() =>
                        downloadSegmentationOverlay(
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
                        onClick={() =>
                          downloadSegmentationMask(cropData.mask_url, cropIndex)
                        }
                      >
                        <FiDownload size={12} />
                        Mask
                      </button>
                    )}
                  </div>
                </div>

                <div className="quadrat-content">
                  <div className="quadrat-visuals">
                    <div className="visual-item">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${cropData.crop_url}`}
                        alt={`Crop ${cropIndex + 1}`}
                        className="analysis-image"
                      />
                      <span className="visual-label">Original Crop</span>
                    </div>
                    <div className="visual-item">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${
                          cropData.overlay_url || cropData.visualization_url
                        }`}
                        alt={`Segmentation Overlay ${cropIndex + 1}`}
                        className="analysis-image"
                      />
                      <span className="visual-label">Coral Overlay</span>
                    </div>
                    {cropData.mask_url && (
                      <div className="visual-item">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${cropData.mask_url}`}
                          alt={`Segmentation Mask ${cropIndex + 1}`}
                          className="analysis-image"
                        />
                        <span className="visual-label">Coral Mask</span>
                      </div>
                    )}
                  </div>

                  {cropData.coverage_data &&
                  cropData.coverage_data.length > 0 ? (
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
                  ) : (
                    <div className="no-coverage-found">
                      <p>ℹ️ No coral coverage detected in this quadrat.</p>
                      {isManualOverride && (
                        <p className="manual-override-note">
                          {isLowConfidence
                            ? `This quadrat was detected with ${(
                                cropData.confidence * 100
                              ).toFixed(
                                1
                              )}% confidence (below 87% threshold) but was manually included. The segmentation model processed it but may not have found distinct coral features to classify.`
                            : "This image was manually included despite no automatic quadrat detection. The segmentation model may not have found coral features to classify."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderManualOverrideModal = () => {
    if (!showManualOverrideModal || !imageToOverride) return null;

    return (
      <div className="confirmation-overlay">
        <div className="manual-override-modal">
          <div className="upload-modal-header">
            <h3>Manual Override Confirmation</h3>
            <button
              className="close-btn"
              onClick={() => setShowManualOverrideModal(false)}
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="upload-modal-content">
            <div className="override-image">
              <img
                src={imageToOverride.image.preview}
                alt="Image to override"
              />
            </div>

            <div className="override-details">
              <p className="reason-text">
                <strong>Reason:</strong> {imageToOverride.image.rejectionReason}
              </p>

              <div className="warning-box">
                <FiAlertTriangle size={16} />
                <div>
                  <p>
                    <strong>Manual Override Warning:</strong>
                  </p>
                  <p>
                    The AI model did not detect any coral quadrats in this
                    image. By manually including it, you're overriding the
                    automated validation.
                  </p>
                  <p>
                    <strong>This may result in:</strong>
                  </p>
                  <ul>
                    <li>Analysis errors if no quadrats are actually present</li>
                    <li>Inaccurate segmentation results</li>
                    <li>Poor quality crops and data</li>
                  </ul>
                  <p>
                    Only proceed if you're confident that coral quadrats exist
                    in this image.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn-cancel"
              onClick={() => setShowManualOverrideModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn-confirm override"
              onClick={confirmManualInclude}
            >
              <FiCheckCircle size={16} />
              Include Anyway
            </button>
          </div>
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
                  disabled={loading || batchLoading || analysisCompleted}
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
                {/* Enhanced Validate Button */}
                <button
                  onClick={validateAllImages}
                  disabled={loading || batchLoading || validationCompleted}
                  className={`upload-button primary ${
                    validationCompleted
                      ? "completed"
                      : loading || batchLoading
                      ? "disabled"
                      : ""
                  }`}
                  title={
                    validationCompleted
                      ? "Validation completed - Clear images to validate new ones"
                      : loading || batchLoading
                      ? "Please wait for current operation to complete"
                      : "Validate all images for coral quadrats"
                  }
                >
                  {loading ? (
                    <>
                      <FiLoader size={16} className="spinning" />
                      <span>Validating...</span>
                    </>
                  ) : validationCompleted ? (
                    <>
                      <FiCheckCircle size={16} />
                      <span>Validation Complete</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      <span>Validate All</span>
                    </>
                  )}
                </button>

                {/* Enhanced Analyze Button */}
                <button
                  onClick={handleBatchAnalyze}
                  disabled={
                    images.length === 0 ||
                    batchLoading ||
                    analysisInProgress ||
                    analysisCompleted ||
                    loading
                  }
                  className={`process-button analysis compact ${
                    analysisCompleted
                      ? "completed"
                      : analysisInProgress || batchLoading
                      ? "disabled"
                      : ""
                  }`}
                  title={
                    analysisCompleted
                      ? "Analysis completed - Clear images to analyze new ones"
                      : analysisInProgress || batchLoading
                      ? "Analysis in progress..."
                      : images.length === 0
                      ? "No images to analyze"
                      : "Start batch analysis of valid images"
                  }
                >
                  {batchLoading || analysisInProgress ? (
                    <>
                      <FiLoader size={16} className="spinning" />
                      <span className="btn-text">
                        Analyzing {batchProgress.current}/{batchProgress.total}
                      </span>
                    </>
                  ) : analysisCompleted ? (
                    <>
                      <FiCheckCircle size={16} />
                      <span className="btn-text">Analysis Complete</span>
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

      {renderConfirmationModal()}
      {renderManualOverrideModal()}

      {renderLoadingOverlay()}
    </div>
  );
}

export default AddImage;
