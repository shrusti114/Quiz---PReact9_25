import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const [form, setForm] = useState({
    studentId: "",
    username: "",
    email: "",
    collegeName: "",
    degree: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // -------------------------------------
  // FETCH AUTO-INCREMENT STUDENT ID
  // -------------------------------------
  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const response = await fetch("http://localhost:5003/Users/nextId");
        const data = await response.json();

        if (response.ok) {
          setForm((prev) => ({ ...prev, studentId: data.nextId }));
        }
      } catch (err) {
        console.log("Error fetching next ID:", err);
      }
    };

    fetchNextId();
  }, []);

  // Validation Schema
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    collegeName: yup.string().required("College Name is required"),
    degree: yup.string().required("Degree is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(form, { abortEarly: false });

      const response = await fetch("http://localhost:5003/Users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Registration Successful!");

        // fetch next ID again
        const res = await fetch("http://localhost:5003/Users/nextId");
        const next = await res.json();

        setForm({
          studentId: next.nextId,
          username: "",
          email: "",
          collegeName: "",
          degree: "",
          password: "",
          confirmPassword: "",
        });

        if (window.confirm("Click OK to go to Login page.")) {
          navigate("/login");
        }
      } else {
        alert(`⚠️ ${data.message}`);
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
    <div className="register-container">
      <h2>Student Registration</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="studentId" value={form.studentId} readOnly />

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email ID"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="collegeName"
          placeholder="Enter College Name"
          value={form.collegeName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="degree"
          placeholder="Enter Degree (e.g., B.Tech, BCA)"
          value={form.degree}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="error">{message}</p>}

      {/* FULL CSS BELOW */}
      <style>{`
        .register-container {
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

        .register-form {
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

export default StudentRegister;
