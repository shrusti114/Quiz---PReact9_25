// src/components/StudentLogin.js
import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Validation Schema
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // ✅ Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });

      const response = await fetch("http://localhost:5003/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Login Successful!");
        // Optionally, save token or user info
        localStorage.setItem("studentData", JSON.stringify(data));
        navigate("/quizpage"); // Redirect to quiz page
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      if (err.inner) {
        setMessage(err.inner.map((e) => e.message).join("\n"));
      } else {
        setMessage(err.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>

      {message && <p className="error">{message}</p>}

      <style>{`
        .login-container {
          background: linear-gradient(to right, #141E30, #243B55);
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
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default StudentLogin;
