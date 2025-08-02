// src/components/admin/hooks/useValidate.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useValidate() {
  const { fetchCsrfToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState("users");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/pending-users",
        {
          withCredentials: true,
        }
      );
      setPendingUsers(response.data.pending_users || []);
    } catch (error) {
      console.error("Failed to fetch pending users:", error);
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Approve user
  const approveUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "approving" }));
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await axios.put(
        `http://localhost:5000/admin/users/${userId}/approve`,
        {},
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      // Remove approved user from pending list
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      alert("User approved successfully!");
    } catch (error) {
      console.error("Failed to approve user:", error);
      alert(error.response?.data?.error || "Failed to approve user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Reject user
  const rejectUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [userId]: "rejecting" }));
    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`http://localhost:5000/admin/users/${userId}/reject`, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true,
      });

      // Remove rejected user from pending list
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      alert("User rejected successfully!");
    } catch (error) {
      console.error("Failed to reject user:", error);
      alert(error.response?.data?.error || "Failed to reject user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Fetch data when component mounts or filter changes
  useEffect(() => {
    if (activeFilter === "users") {
      fetchPendingUsers();
    }
  }, [activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    pendingUsers,
    loading,
    actionLoading,
    approveUser,
    rejectUser,
    refetch: fetchPendingUsers,
  };
}
