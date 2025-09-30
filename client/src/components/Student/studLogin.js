// StudLogin.js
import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const StudLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/students/login", {
        email,
        password,
      });

      if (response.data.success) {
        if (window.confirm("✅ Login Successful! Click OK to choose a subject.")) {
          navigate("/student/choose-subject"); // Navigate to subject selection
        }
      } else {
        alert("❌ Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed! Try again later.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#1a1a1a", p: 2 }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box sx={{ p: 5, borderRadius: "20px", bgcolor: "transparent", border: "1px solid #fff", boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#fff", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
            🎓 Student Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "#fff", fontSize: '16px' } }}
              sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, py: 1.5, fontSize: "16px", fontWeight: "bold", borderRadius: "10px", textTransform: "none" }}
            >
              Login
            </Button>

            <Box textAlign="center" mt={2}>
              <Link component="button" onClick={() => navigate("/sregister")} sx={{ color: "#00bcd4", textDecoration: "underline", cursor: "pointer" }}>
                Don't have an account? Register
              </Link>
            </Box>
          </form>
        </Box>
      </Container>

      <Box sx={{ mt: 4, py: 2, textAlign: "center", width: "100%", color: "white", fontSize: "14px" }}>
        © {new Date().getFullYear()} Student Portal | All Rights Reserved
      </Box>
    </Box>
  );
};

export default StudLogin;
