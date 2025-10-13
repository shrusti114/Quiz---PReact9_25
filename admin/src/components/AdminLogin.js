import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- react-router hook

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Show alert
        alert("✅ Login successful!");
        localStorage.setItem("adminToken", "loggedin"); // demo token
        // 🔹 redirect to AdminDashboard
        navigate("/admin-dashboard");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

// Inline CSS
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "radial-gradient(circle at center, #1e1e1e, #000)",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    margin: 0,
  },
  loginBox: {
    backgroundColor: "#111",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    width: "350px",
    maxWidth: "90%",
    textAlign: "center",
    color: "#fff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#00bcd4",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    textAlign: "left",
    marginBottom: "8px",
    color: "#ccc",
    fontWeight: 500,
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    marginBottom: "18px",
    border: "none",
    borderRadius: "8px",
    background: "#222",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },
  button: {
    background: "#00bcd4",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    transition: "background 0.3s ease",
  },
  message: {
    marginTop: "15px",
    fontWeight: 500,
    fontSize: "14px",
    color: "#ff5555",
    textAlign: "center",
  },
};

export default AdminLogin;
