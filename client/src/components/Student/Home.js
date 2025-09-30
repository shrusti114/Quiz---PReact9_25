import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Styled Gooey Button
const GooeyButton = styled(Button)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  padding: "10px 25px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "12px",
  color: "#fff",
  background: "linear-gradient(45deg, #6a11cb, #2575fc)",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px) scale(1.05)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-75%",
    width: "50%",
    height: "100%",
    background: "rgba(255,255,255,0.2)",
    transform: "skewX(-25deg)",
    transition: "all 0.5s",
  },
  "&:hover::after": {
    left: "125%",
  },
}));

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 4,
        background: "linear-gradient(-45deg, #1a2a6c, #b21f1f, #fdbb2d, #22c1c3)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        padding: 2,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "#fff",
          textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        🎯 Quiz App
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "#fff",
          textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
        }}
      >
        Test your knowledge and have fun!
      </Typography>

      <Box display="flex" gap={3} flexWrap="wrap">
        <GooeyButton onClick={() => navigate("/dashboard")}>▶️ Student Dashboard</GooeyButton>
        <GooeyButton onClick={() => navigate("/adminlogin")}>🛠 Admin Login</GooeyButton>
        <GooeyButton onClick={() => navigate("/teacherlogin")}>👩‍🏫 Teacher Login</GooeyButton>
        <GooeyButton onClick={() => navigate("/about")}>ℹ️ About</GooeyButton>
        <GooeyButton onClick={() => navigate("/contact")}>📞 Contact</GooeyButton>
      </Box>

      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
    </Box>
  );
}

export default Home;
