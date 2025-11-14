import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeacherLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bgColor, setBgColor] = useState("#0f2027");

  // Background animation
  useEffect(() => {
    const colors = ["#0f2027", "#203a43", "#2c5364", "#485563", "#29323c"];
    let i = 0;

    const interval = setInterval(() => {
      setBgColor(colors[i]);
      i = (i + 1) % colors.length;
    }, 2000);

    return () => clearInterval(interval);
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
        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 1500,
        });

        setTimeout(() => {
          onLogin(data.teacher);
        }, 1500);
      } else {
        toast.error("Invalid Email or Password", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error! Try again.", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        background: bgColor,
        transition: "background 2s ease",
      }}
    >
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Teacher Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password:</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>

      {/* Toast Fixed */}
      <ToastContainer newestOnTop={false} />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    width: "350px",
    padding: "40px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    backdropFilter: "blur(6px)",
    color: "#fff",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    width: "100%",
  },
  button: {
    padding: "10px",
    backgroundColor: "#00bcd4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
