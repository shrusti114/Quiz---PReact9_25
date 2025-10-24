import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ email, password }, { abortEarly: false });

      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Login Successful!", { position: "top-center" });
        localStorage.setItem("adminToken", "loggedin");
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      } else {
        toast.error(data.message || "Login failed", { position: "top-center" });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        toast.error(err.errors.join("\n"), { position: "top-center" });
      } else {
        toast.error("Server error. Try again later.", { position: "top-center" });
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <h2 className="login-title">Admin Portal</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>

      <style>{`
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
        }
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1b1b1b 40%, #2b2b2b 100%);
        }
        .login-box {
          background: rgba(20, 20, 20, 0.95);
          padding: 50px 40px;
          border-radius: 20px;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.08);
          width: 360px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #00e0ff;
          margin-bottom: 25px;
          text-shadow: 0 0 10px rgba(0, 224, 255, 0.5);
        }
        .login-form {
          display: flex;
          flex-direction: column;
        }
        .login-form label {
          text-align: left;
          color: #aaa;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .login-form input {
          background: #111;
          color: #fff;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
          transition: 0.3s;
        }
        .login-form input:focus {
          outline: none;
          border-color: #00e0ff;
          box-shadow: 0 0 8px rgba(0, 224, 255, 0.5);
        }
        .login-btn {
          background: linear-gradient(135deg, #00e0ff, #0078ff);
          color: #fff;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 0 15px rgba(0, 224, 255, 0.3);
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(0, 224, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
