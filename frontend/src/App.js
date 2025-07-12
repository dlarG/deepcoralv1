// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="/biologist-dashboard" element={<div>Biologist Dashboard</div>} />
        <Route path="/user-dashboard" element={<div>User Dashboard</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
