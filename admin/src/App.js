import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import DepartmentManagement from "./components/DepartmentManagement";
import SubjectManagement from "./components/SubjectManagement";
import TeacherManagement from "./components/TeacherManagement";
import ManageQuizzes from "./components/ManageQuizzes";
import ManageResults from "./components/ManageResults";
import ManageUsers from "./components/ManageUsers";

function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Management Pages */}
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/subjects" element={<SubjectManagement />} />
        <Route path="/teachers" element={<TeacherManagement />} />

        {/* Manage Pages */}
        <Route path="/manage-quizzes" element={<ManageQuizzes />} />
        <Route path="/manage-results" element={<ManageResults />} />
        <Route path="/manage-users" element={<ManageUsers />} />

      </Routes>
    </Router>
  );
}

export default App;
