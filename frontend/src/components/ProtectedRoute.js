// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Verify auth status when the protected route mounts
    const verifyAuth = async () => {
      await checkAuthStatus();
    };
    verifyAuth();
  }, [checkAuthStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredRole &&
    user.roletype.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
