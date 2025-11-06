import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Fetch teacher details from MongoDB using email
        const teacherResponse = await fetch(`http://localhost:5002/teacher?email=${email}`);
        const teacherData = await teacherResponse.json();

        const teacherName = teacherData?.teacher_name || "Teacher";

        // ✅ Success Toast with fetched teacher name
        toast.success(`✅ Welcome, ${teacherName}! Login Successful.`, {
          position: "top-center",
          autoClose: false,
          closeButton: (
            <button
              style={{
                backgroundColor: "#00bcd4",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => {
                toast.dismiss();
                window.location.href = "/quiz";
              }}
            >
              OK
            </button>
          ),
        });

        setEmail("");
        setPassword("");
      } else {
        toast.error("❌ Invalid Email or Password!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("⚠️ Server Connection Failed!", {
        position: "top-center",
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Teacher Login</h2>
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

// ✅ Styling
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d0d1f, #1b1b2f, #24243e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    backgroundColor: "rgba(30, 30, 50, 0.95)",
    padding: "50px 60px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
    textAlign: "center",
    width: "400px",
  },
  title: {
    color: "#00bcd4",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    textTransform: "uppercase",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#ddd",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #444",
    outline: "none",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "15px",
    transition: "0.3s",
  },
  button: {
    background: "linear-gradient(90deg, #00bcd4, #007a99)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    padding: "12px 0",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default TeacherLogin;
