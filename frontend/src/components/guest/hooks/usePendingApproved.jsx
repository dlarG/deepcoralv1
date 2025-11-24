import { useState, useCallback } from "react";

const usePendingApproved = () => {
  const [pendingApprovedImages, setPendingApprovedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [summary, setSummary] = useState(null);

  const fetchPendingApprovedImages = useCallback(async () => {
    setLoading(true);
    try {
      // Fixed URL - add /approved prefix
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/approved/guest/pending-approved-images`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingApprovedImages(data.pending_approved_images || []);
        setUserInfo(data.user_info);
        setSummary(data.summary);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch pending approved images:", errorData);
        throw new Error(errorData.error || "Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching pending approved images:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeImage = useCallback(async (imageId) => {
    setAnalyzing(true);
    try {
      // Fixed URL - add /approved prefix
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/approved/guest/analyze-pending-approved/${imageId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the image in the list to reflect that it's been analyzed
        setPendingApprovedImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  has_segmentation: true,
                  processing_status: "completed",
                }
              : img
          )
        );

        return result;
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const batchAnalyzeImages = useCallback(async (imageIds) => {
    setAnalyzing(true);
    try {
      // Fixed URL - add /approved prefix
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/approved/guest/batch-analyze-pending-approved`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_ids: imageIds }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update analyzed images
        setPendingApprovedImages((prev) =>
          prev.map((img) =>
            imageIds.includes(img.id)
              ? {
                  ...img,
                  has_segmentation: true,
                  processing_status: "completed",
                }
              : img
          )
        );

        return result;
      } else {
        throw new Error(result.error || "Batch analysis failed");
      }
    } catch (error) {
      console.error("Batch analysis error:", error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    pendingApprovedImages,
    loading,
    analyzing,
    userInfo,
    summary,
    fetchPendingApprovedImages,
    analyzeImage,
    batchAnalyzeImages,
  };
};

export default usePendingApproved;
