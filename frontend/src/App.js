// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import GuestDashboard from "./components/GuestDashboard";
import BiologistDashboard from "./components/BiologistDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserProfile from "./components/admin/components/UserProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Update this route to match the navigation pattern */}
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* Keep the old route as fallback if needed */}
          <Route
            path="/user-profile/:userId"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/biologist-dashboard"
            element={
              <ProtectedRoute requiredRole="biologist">
                <BiologistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <GuestDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes similarly */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
