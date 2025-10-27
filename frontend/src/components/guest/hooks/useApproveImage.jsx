import { useState, useCallback } from "react";

const useApprovedImage = () => {
  const [approvedImages, setApprovedImages] = useState([]);
  const [rejectedImages, setRejectedImages] = useState([]);
  const [analyzedImages, setAnalyzedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [summary, setSummary] = useState(null);

  const fetchApprovedImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/approved/guest/approved-images",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Approved images data:", data); // Debug log

        setApprovedImages(data.approved_images || []);
        setRejectedImages(data.rejected_images || []);
        setUserInfo(data.user_info || null);
        setSummary(data.summary || null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Response error:", errorData);
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to fetch approved images`
        );
      }
    } catch (error) {
      console.error("Error fetching approved images:", error);

      // Set empty states on error
      setApprovedImages([]);
      setRejectedImages([]);
      setUserInfo(null);
      setSummary(null);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalyzedImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/approved/guest/analyzed-images",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalyzedImages(data.analyzed_images || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analyzed images");
      }
    } catch (error) {
      console.error("Error fetching analyzed images:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchAnalyzeImages = useCallback(async (imageIds) => {
    setAnalyzing(true);
    try {
      // Get CSRF token first
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

      const response = await fetch(
        `${API_BASE_URL}/approved/guest/batch-analyze-approved`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfData.csrf_token, // Add CSRF token
          },
          credentials: "include",
          body: JSON.stringify({ image_ids: imageIds }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to batch analyze images");
      }
    } catch (error) {
      console.error("Error batch analyzing images:", error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  // Also update single image analysis
  const analyzeImage = useCallback(async (imageId) => {
    setAnalyzing(true);
    try {
      // Get CSRF token first
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

      const response = await fetch(
        `${API_BASE_URL}/approved/guest/analyze-approved-image/${imageId}`,
        {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrfData.csrf_token, // Add CSRF token
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    approvedImages,
    rejectedImages,
    analyzedImages,
    loading,
    analyzing,
    userInfo,
    summary,
    fetchApprovedImages,
    fetchAnalyzedImages,
    analyzeImage,
    batchAnalyzeImages,
  };
};

export default useApprovedImage;
