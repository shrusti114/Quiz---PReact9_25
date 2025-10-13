import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Styled Gooey Button
const GooeyButton = styled(Button)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  padding: "12px 30px",
  fontSize: "18px",
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
      {/* Title */}
      <Typography
        variant="h2"
        sx={{
          color: "#fff",
          textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        🎯 Quiz App
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h5"
        sx={{
          color: "#fff",
          textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
        }}
      >
        Test your knowledge and have fun!
      </Typography>

      {/* Buttons */}
      <Box display="flex" gap={3} flexWrap="wrap">
        <GooeyButton onClick={() => navigate("/dashboard")}>▶️ Start Quiz</GooeyButton>
        <GooeyButton onClick={() => navigate("/contact")}>📞 Contact</GooeyButton>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          marginTop: 5,
          padding: 3,
          maxWidth: "600px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#fff", marginBottom: 2 }}
        >
          ℹ️ About
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#eee", fontSize: "1.1rem", lineHeight: 1.6 }}
        >
          Welcome to our Quiz App! 🚀  
          Challenge yourself with fun questions, track your progress,  
          and enhance your knowledge while enjoying the game. 🎉
        </Typography>
      </Box>

      {/* Background Animation */}
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
