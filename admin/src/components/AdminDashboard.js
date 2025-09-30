// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [report, setReport] = useState({
    students: 0,
    teachers: 0,
    departments: 0,
    subjects: 0,
  });

  useEffect(() => {
    // Example API call
    fetch("http://localhost:5005/admin/report")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Error fetching report:", err));
  }, []);

  const downloadReport = () => {
    const content =
      "Quiz Admin Report\n\n" +
      "Total Students: " + report.students + "\n" +
      "Total Teachers: " + report.teachers + "\n" +
      "Total Departments: " + report.departments + "\n" +
      "Total Subjects: " + report.subjects + "\n" +
      "Generated At: " + new Date().toLocaleString();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz_admin_report.txt";
    link.click();
  };

  const statsData = [
    { name: "Students", value: report.students },
    { name: "Teachers", value: report.teachers },
    { name: "Departments", value: report.departments },
    { name: "Subjects", value: report.subjects },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#1f2d3d",
          padding: "30px 20px",
          color: "white",
        }}
      >
        <h2 style={{ color: "white", marginBottom: "40px" }}>Quiz Admin</h2>
        <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
          <li>
            <Link to="/admin/dashboard" style={linkStyle}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-students" style={linkStyle}>
              👨‍🎓 Student Management
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-teachers" style={linkStyle}>
              👨‍🏫 Teacher Management
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-departments" style={linkStyle}>
              🏢 Department Management
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-subjects" style={linkStyle}>
              📘 Subject Management
            </Link>
          </li>
        </ul>
        <button style={logoutButton}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#f6f6f6", padding: "30px" }}>
        <h2 style={{ marginBottom: "25px" }}>📊 Admin Dashboard</h2>

        {/* Stats Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div style={cardStyle}>
            {" "}
            <h4>Total Students</h4>
            <p>{report.students}</p>{" "}
          </div>
          <div style={cardStyle}>
            {" "}
            <h4>Total Teachers</h4>
            <p>{report.teachers}</p>{" "}
          </div>
          <div style={cardStyle}>
            {" "}
            <h4>Total Departments</h4>
            <p>{report.departments}</p>{" "}
          </div>
          <div style={cardStyle}>
            {" "}
            <h4>Total Subjects</h4>
            <p>{report.subjects}</p>{" "}
          </div>
        </div>

        {/* Graph */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ marginBottom: "20px" }}>Overview Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadReport}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  background: "white",
  flex: 1,
  minWidth: "220px",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "8px 0",
};

const logoutButton = {
  marginTop: "40px",
  padding: "10px 20px",
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  width: "100%",
};

export default AdminDashboard;
