import React, { useState } from "react";

export default function TeacherLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5002/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      alert("✅ Login successful!");
      onLogin(data.teacher);
    } else {
      alert("❌ Invalid credentials!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Teacher Login</h2>
      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "100px" },
  input: { margin: "8px", padding: "10px", width: "250px" },
  button: {
    padding: "10px 20px",
    backgroundColor: "#00bcd4",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
  },
};
