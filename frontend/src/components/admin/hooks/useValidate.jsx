import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function useValidate() {
  const { fetchCsrfToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState("users");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [pendingAction, setPendingAction] = useState(null); // { type: 'approve'|'reject', userId: number }

  // Modal state for success/error messages
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    autoClose: true,
  });

  const showSuccessModal = (title, message, autoClose = true) => {
    setModalConfig({
      title,
      message,
      type: "success",
      autoClose,
    });
    setShowModal(true);
  };

  const showErrorModal = useCallback((title, message) => {
    setModalConfig({
      title,
      message,
      type: "error",
      autoClose: false,
    });
    setShowModal(true);
  }, []);

  const showWarningModal = (title, message) => {
    setModalConfig({
      title,
      message,
      type: "warning",
      autoClose: false,
    });
    setShowModal(true);
  };

  const fetchPendingUsers = useCallback(async () => {
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

      if (error.response?.status === 401) {
        showErrorModal(
          "Authentication Required",
          "Your session has expired. Please log in again to access pending users."
        );
      } else if (error.response?.status === 403) {
        showErrorModal(
          "Access Denied",
          "You don't have permission to view pending users. Contact your administrator."
        );
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Failed to Load Pending Users",
          "Unable to fetch pending user data. Please refresh the page or try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [showErrorModal]);

  const approveUser = (userId) => {
    const user = pendingUsers.find((u) => u.id === userId);
    const userName = user ? `${user.firstname} ${user.lastname}` : "this user";

    setPendingAction({ type: "approve", userId });
    setModalConfig({
      title: "Confirm User Approval",
      message: `Are you sure you want to approve ${userName}?\n\nThis will:\n• Grant them access to the system\n• Allow them to use their account immediately`,
      type: "success",
      autoClose: false,
      customActions: true,
    });
    setShowModal(true);
  };

  const rejectUser = (userId) => {
    const user = pendingUsers.find((u) => u.id === userId);
    const userName = user ? `${user.firstname} ${user.lastname}` : "this user";

    // Store pending action and show warning modal
    setPendingAction({ type: "reject", userId });
    setModalConfig({
      title: "Confirm User Rejection",
      message: `Are you sure you want to reject ${userName}?\n\nThis action will:\n• Permanently remove their registration\n• Cannot be undone`,
      type: "warning",
      autoClose: false,
      customActions: true,
    });
    setShowModal(true);
  };

  const confirmApproveUser = async () => {
    if (!pendingAction || pendingAction.type !== "approve") return;

    const { userId } = pendingAction;
    const user = pendingUsers.find((u) => u.id === userId);
    const userName = user ? `${user.firstname} ${user.lastname}` : "User";

    setActionLoading((prev) => ({ ...prev, [userId]: "approving" }));
    setShowModal(false);
    setPendingAction(null);

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.put(
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

      showSuccessModal(
        "User Approved Successfully! 🎉",
        `${userName} has been approved and granted access to the system.\n\nThey can now log in and start using their account.`,
        true
      );
    } catch (error) {
      console.error("Failed to approve user:", error);

      if (error.response?.status === 401) {
        showErrorModal(
          "Authentication Required",
          "Your session has expired. Please log in again to continue."
        );
      } else if (error.response?.status === 403) {
        showErrorModal(
          "Permission Denied",
          "You don't have permission to approve users. Contact your administrator."
        );
      } else if (error.response?.status === 404) {
        showErrorModal(
          "User Not Found",
          "The user you're trying to approve no longer exists or may have already been processed."
        );
        // Remove from pending list
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Already Processed",
          "This user has already been approved or rejected by another administrator."
        );
        // Refresh the pending users list
        fetchPendingUsers();
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Approval Failed",
          error.response?.data?.error ||
            "Failed to approve user. Please try again or contact support."
        );
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const confirmRejectUser = async () => {
    if (!pendingAction || pendingAction.type !== "reject") return;

    const { userId } = pendingAction;
    const user = pendingUsers.find((u) => u.id === userId);
    const userName = user ? `${user.firstname} ${user.lastname}` : "User";

    setActionLoading((prev) => ({ ...prev, [userId]: "rejecting" }));
    setShowModal(false);
    setPendingAction(null);

    try {
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`http://localhost:5000/admin/users/${userId}/reject`, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true,
      });

      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));

      showSuccessModal(
        "User Rejected Successfully 🚫",
        `${userName} has been rejected and removed from the pending list.\n\nThey have been notified of the decision.`,
        true
      );
    } catch (error) {
      console.error("Failed to reject user:", error);

      if (error.response?.status === 401) {
        showErrorModal(
          "Authentication Required",
          "Your session has expired. Please log in again to continue."
        );
      } else if (error.response?.status === 403) {
        showErrorModal(
          "Permission Denied",
          "You don't have permission to reject users. Contact your administrator."
        );
      } else if (error.response?.status === 404) {
        showErrorModal(
          "User Not Found",
          "The user you're trying to reject no longer exists or may have already been processed."
        );
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      } else if (error.response?.status === 409) {
        showErrorModal(
          "Already Processed",
          "This user has already been approved or rejected by another administrator."
        );
        fetchPendingUsers();
      } else if (error.code === "NETWORK_ERROR") {
        showErrorModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showErrorModal(
          "Rejection Failed",
          error.response?.data?.error ||
            "Failed to reject user. Please try again or contact support."
        );
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const cancelAction = () => {
    console.log("cancelAction called - closing modal");
    setPendingAction(null);
    setShowModal(false);
  };

  const handleConfirm = () => {
    console.log("handleConfirm called with pendingAction:", pendingAction);
    if (!pendingAction) return;

    if (pendingAction.type === "approve") {
      console.log("Confirming approval");
      confirmApproveUser();
    } else if (pendingAction.type === "reject") {
      console.log("Confirming rejection");
      confirmRejectUser();
    }
  };

  const bulkApproveUsers = (userIds) => {
    if (userIds.length === 0) {
      showWarningModal(
        "No Users Selected",
        "Please select at least one user to approve."
      );
      return;
    }

    const userCount = userIds.length;
    setModalConfig({
      title: "📋 Bulk Approve Users",
      message: `Are you sure you want to approve ${userCount} user(s)?\n\nThis will grant all selected users access to the system immediately.`,
      type: "success",
      autoClose: false,
      customActions: true,
    });
    setPendingAction({ type: "bulk_approve", userIds });
    setShowModal(true);
  };

  // Execute bulk approval
  // const confirmBulkApprove = async () => {
  //   if (!pendingAction || pendingAction.type !== "bulk_approve") return;

  //   const { userIds } = pendingAction;
  //   setShowModal(false);
  //   setPendingAction(null);

  //   try {
  //     const csrfToken = await fetchCsrfToken();
  //     const approvalPromises = userIds.map((userId) =>
  //       axios.put(
  //         `http://localhost:5000/admin/users/${userId}/approve`,
  //         {},
  //         {
  //           headers: { "X-CSRF-Token": csrfToken },
  //           withCredentials: true,
  //         }
  //       )
  //     );

  //     await Promise.all(approvalPromises);

  //     // Remove approved users from pending list
  //     setPendingUsers((prev) =>
  //       prev.filter((user) => !userIds.includes(user.id))
  //     );

  //     showSuccessModal(
  //       "Bulk Approval Successful! 🎊",
  //       `${userIds.length} user(s) have been successfully approved and can now access the system.`,
  //       true
  //     );
  //   } catch (error) {
  //     console.error("Bulk approval failed:", error);
  //     showErrorModal(
  //       "Bulk Approval Failed",
  //       "Some users could not be approved. Please refresh the page and try again."
  //     );
  //     // Refresh the list to see current state
  //     fetchPendingUsers();
  //   }
  // };

  // Fetch data when component mounts or filter changes
  useEffect(() => {
    if (activeFilter === "users") {
      fetchPendingUsers();
    }
  }, [activeFilter, fetchPendingUsers]);

  return {
    activeFilter,
    setActiveFilter,
    pendingUsers,
    loading,
    actionLoading,
    approveUser,
    rejectUser,
    refetch: fetchPendingUsers,

    // New bulk operations upcoming pa
    bulkApproveUsers,

    // Modal states and functions
    showModal,
    modalConfig,
    setShowModal,
    showSuccessModal,
    showErrorModal,
    showWarningModal,
    handleConfirm,
    cancelAction,
    pendingAction,
  };
}
