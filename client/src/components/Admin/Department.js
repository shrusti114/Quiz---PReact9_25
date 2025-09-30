// Department.js
import React from "react";
import { useLocation } from "react-router-dom";

function Department() {
  const location = useLocation();
  const { adminName, adminID, email } = location.state || {};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏢 Department Dashboard</h1>

      {adminName && (
        <div style={styles.card}>
          <h2>Welcome, {adminName} 🎉</h2>
          <p><strong>Admin ID:</strong> {adminID}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      )}

      <div style={styles.card}>
        <h3>⚙️ Manage Sections</h3>
        <ul>
          <li>📘 Student Records</li>
          <li>👨‍🏫 Teachers</li>
          <li>📊 Reports</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "30px",
    color: "#222",
  },
  card: {
    background: "#fff",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "500px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};

export default Department;
