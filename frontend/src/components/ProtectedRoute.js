// src/components/ProtectedRoute.js
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// In ProtectedRoute.js
export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, checkAuthStatus } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !user && !loading) {
      initialized.current = true;
      checkAuthStatus();
    }
  }, [user, loading, checkAuthStatus]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredRole &&
    user.roletype?.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
