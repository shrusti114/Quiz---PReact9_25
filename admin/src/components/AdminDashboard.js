import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const stats = [
    { label: "Students", value: 120, color: "#4E73DF" },
    { label: "Teachers", value: 15, color: "#1CC88A" },
    { label: "Departments", value: 5, color: "#F6C23E" },
    { label: "Subjects", value: 20, color: "#E74A3B" },
  ];

  const menuItems = [
    { label: "Dashboard", route: "/admin-dashboard" },
    { label: "Departments", route: "/departments" },
    { label: "Teachers", route: "/teachers" },
    { label: "Subjects", route: "/subjects" },
    { label: "Logout", route: "/admin-login" },
  ];

  const handleMenuClick = (item) => {
    setMenuVisible(false);
    if (item.label === "Logout") {
      alert("Logged out!");
      localStorage.removeItem("adminToken");
    }
    navigate(item.route);
  };

  const lineData = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        label: "Overview",
        data: stats.map((s) => s.value),
        borderColor: "#4E73DF",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: stats.map((s) => s.label),
    datasets: [{ data: stats.map((s) => s.value), backgroundColor: stats.map((s) => s.color) }],
  };

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#F5F7FA", fontFamily: "Arial" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Dashboard</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 10 }}>Admin</span>
          <button onClick={() => setMenuVisible(!menuVisible)} style={{ fontSize: 20, cursor: "pointer" }}>☰</button>
        </div>
      </div>

      {/* Menu */}
      {menuVisible && (
        <div style={{ background: "#fff", padding: 10, borderRadius: 10, marginBottom: 20, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          {menuItems.map((item) => (
            <div key={item.label} onClick={() => handleMenuClick(item)} style={{ padding: 6, cursor: "pointer" }}>
              {item.label}
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 25, justifyContent: "space-between" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ flex: "1 1 200px", borderRadius: 12, padding: 15, color: "#fff", background: s.color }}>
            <div>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: "bold" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div style={{ flex: "1 1 400px", background: "#fff", padding: 15, borderRadius: 12 }}>
          <h3>Line Chart</h3>
          <Line data={lineData} />
        </div>
        <div style={{ flex: "1 1 400px", background: "#fff", padding: 15, borderRadius: 12 }}>
          <h3>Pie Chart</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
