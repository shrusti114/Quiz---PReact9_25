import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import DepartmentManagement from "./components/DepartmentManagement";

function App() {
  // Check if admin is logged in (demo: using localStorage)
  const isAdminLoggedIn = localStorage.getItem("adminToken") === "loggedin";

  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      
      {/* Protected Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/" />
        }
      />

      {/* Departments Page */}
      <Route
        path="/departments"
        element={
          isAdminLoggedIn ? <DepartmentManagement /> : <Navigate to="/" />
        }
      />

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
