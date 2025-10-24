import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import DepartmentManagement from "./components/DepartmentManagement";
import SubjectManagement from "./components/SubjectManagement";
import TeacherManagement from "./components/TeacherManagement"; // import Teacher component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/subjects" element={<SubjectManagement />} />
        <Route path="/teachers" element={<TeacherManagement />} /> {/* <-- Add this */}
      </Routes>
    </Router>
  );
}

export default App;
