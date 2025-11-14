import React from "react";

export default function Navbar({ onDashboard, onCreateQuiz, onViewStudents, onLogout }) {
  const styles = {
    nav: {
      background: "linear-gradient(90deg, #1a237e, #3949ab)",
      padding: "15px 0",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    button: {
      color: "white",
      margin: "0 15px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
    },
  };

  return (
    <nav style={styles.nav}>
      <button style={styles.button} onClick={onDashboard}>Dashboard</button>
      <button style={styles.button} onClick={onCreateQuiz}>Create Quiz</button>
      <button style={styles.button} onClick={onViewStudents}>View Students</button>
      <button style={styles.button} onClick={onLogout}>Logout</button>
    </nav>
  );
}
