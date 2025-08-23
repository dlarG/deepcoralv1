// src/components/guest/hooks/useCoralLifeForms.js
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function useCoralLifeForms() {
  const { authAxios } = useAuth();
  const [coralData, setCoralData] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoral, setSelectedCoral] = useState(null);

  useEffect(() => {
    authAxios
      .get("/coral_info")
      .then((response) => {
        setCoralData(response.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch coral data:", err);
      });
  }, [authAxios]);

  const filteredCorals = coralData.filter((coral) => {
    const matchesClassification =
      selectedClassification === "all" ||
      coral.classification.toLowerCase() ===
        selectedClassification.toLowerCase();
    const matchesSearch =
      coral.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coral.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClassification && matchesSearch;
  });

  const groupedCorals = filteredCorals.reduce((acc, coral) => {
    const classification = coral.classification;
    if (!acc[classification]) acc[classification] = [];
    acc[classification].push(coral);
    return acc;
  }, {});

  return {
    coralData,
    filteredCorals,
    groupedCorals,
    selectedClassification,
    searchTerm,
    selectedCoral,
    setSelectedClassification,
    setSearchTerm,
    setSelectedCoral,
  };
}
