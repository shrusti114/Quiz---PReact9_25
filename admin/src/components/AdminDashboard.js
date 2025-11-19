import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const stats = [
    { label: "Students", value: 120, color: "#00bfff" },
    { label: "Teachers", value: 15, color: "#1cc88a" },
    { label: "Departments", value: 5, color: "#f6c23e" },
    { label: "Subjects", value: 20, color: "#e74a3b" },
  ];

  // ✅ UPDATED: Added 3 new menu items
  const menuItems = [
    { label: "Dashboard", route: "/admin-dashboard" },
    { label: "Departments", route: "/departments" },
    { label: "Subjects", route: "/subjects" },
    { label: "Teachers", route: "/teachers" },
  
{ label: "Manage Users", route: "/users" },
    { label: "Manage Quizzes", route: "/manage-quizzes" },
    { label: "Manage Results", route: "/manage-results" },
    { label: "Subject Management", route: "/subject-management" },
    { label: "Logout", route: "/" },
  ];

  const handleMenuClick = (item) => {
    setMenuVisible(false);
    if (item.label === "Logout") {
      alert("Logged out!");
      localStorage.removeItem("adminToken");
    }
    navigate(item.route);
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <div style={styles.userMenu}>
          <span>Welcome, Admin</span>
          <button
            style={styles.menuToggle}
            onClick={() => setMenuVisible(!menuVisible)}
          >
            ☰
          </button>
        </div>
      </header>

      {menuVisible && (
        <div style={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleMenuClick(item)}
              style={styles.menuItem}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

      {/* KPI Section */}
      <section style={styles.kpiSection}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...styles.kpiCard, background: s.color }}>
            <h3>{s.label}</h3>
            <p>{s.value}</p>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section style={styles.chartsSection}>
        <div style={styles.chartCard}>
          <h3>Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats}
              barSize={40}
              margin={{ top: 30, right: 30, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e0ff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0078ff" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="label" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  background: "#2e2e4f",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="value"
                fill="url(#waveGradient)"
                radius={[10, 10, 0, 0]}
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3>Data Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats}
                dataKey="value"
                nameKey="label"
                outerRadius={120}
                fill="#8884d8"
                label
                animationDuration={2000}
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#2e2e4f",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section style={styles.teacherSection}>
        <div style={styles.teacherCard}>
          <h3>👩‍🏫 Manage Teachers</h3>
          <p>
            View, Add, Update, or Delete teachers. Assign subjects and track
            department distribution.
          </p>
          <button
            style={styles.teacherButton}
            onClick={() => navigate("/teachers")}
          >
            Go to Teacher Management
          </button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  dashboard: {
    background: "linear-gradient(135deg, #1e1e2f, #2e2e4f)",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#2e2e4f",
    padding: "15px 25px",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  },
  title: {
    color: "#00e0ff",
    textShadow: "0 0 10px rgba(0,224,255,0.7)",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  menuToggle: {
    background: "#00bfff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "20px",
    padding: "5px 10px",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0,191,255,0.5)",
  },
  sidebarMenu: {
    position: "absolute",
    top: "80px",
    right: "20px",
    background: "#3b3b5c",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)",
  },
  menuItem: {
    padding: "10px",
    cursor: "pointer",
    color: "white",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  kpiSection: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  kpiCard: {
    width: "200px",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  },
  chartsSection: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "40px",
    flexWrap: "wrap",
    gap: "30px",
  },
  chartCard: {
    background: "#2e2e4f",
    borderRadius: "12px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
  },
  teacherSection: {
    marginTop: "50px",
    textAlign: "center",
  },
  teacherCard: {
    background: "#2e2e4f",
    padding: "30px",
    borderRadius: "12px",
    width: "80%",
    margin: "auto",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  },
  teacherButton: {
    background: "linear-gradient(90deg, #00bcd4, #0097a7)",
    border: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default AdminDashboard;
