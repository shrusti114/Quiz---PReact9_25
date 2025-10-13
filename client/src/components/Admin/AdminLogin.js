// AdminLogin.js
import React, { useState } from "react";

function AdminLogin() {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Generate unique admin ID (for demo purpose, static prefix + random number)
  const generateAdminID = () => {
    return "ADM" + Math.floor(1000 + Math.random() * 9000); // e.g., ADM4532
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (adminName === "" || email === "" || password === "") {
      alert("❌ Please fill in all fields!");
      return;
    }

    // Dummy authentication
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminID = generateAdminID();
      alert(
        `✅ Welcome ${adminName}!\nAdmin ID: ${adminID}\nEmail: ${email}`
      );

      // Navigate to full external URL (AdminDashboard running on port 3001)
      window.location.href = "http://localhost:3001/admin-dashboard";
    } else {
      alert("❌ Invalid Credentials! Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛠️ Admin Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Admin Name</label>
        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          required
          style={styles.input}
          placeholder="Enter your name"
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          placeholder="Enter your email"
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          placeholder="Enter your password"
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "420px",
    margin: "60px auto",
    padding: "30px",
    background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    background: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s ease",
  },
};

export default AdminLogin;
