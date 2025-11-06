import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("⚠️ Please enter both Email and Password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Login Successful!");
        navigate("/quizpage"); // redirect to quiz page
      } else {
        setMessage(`❌ ${data.message || "Invalid email or password"}`);
      }
    } catch (error) {
      setMessage("⚠️ Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {message && <p className="error">{message}</p>}

      <style>{`
        .login-container {
          background: linear-gradient(to right, #232526, #414345);
          color: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        input {
          margin: 10px 0;
          padding: 10px;
          border: none;
          border-radius: 5px;
          outline: none;
          font-size: 1rem;
        }

        input:focus {
          border: 2px solid #00BFFF;
        }

        button {
          margin-top: 15px;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: #00BFFF;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          background: #008CBA;
        }

        .error {
          color: #ff5555;
          margin-top: 10px;
          font-size: 0.9rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default StudentLogin;
