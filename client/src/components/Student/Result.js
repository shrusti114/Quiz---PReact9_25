import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Result = () => {
  const location = useLocation();
  const { score, total, studentName, studentID } = location.state || {};

  if (!score) return <h2>No result data available.</h2>;

  // Message based on score
  let message = "";
  if (score === total) message = "🎉 Well Done! Perfect Score!";
  else if (score >= 12) message = "Very Good! Keep it up!";
  else message = "Good! You can do better!";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #00c6ff, #0072ff)",
        color: "#fff",
        textAlign: "center",
        p: 4,
      }}
    >
      <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold" }}>
        🎉 Congratulations!
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Name: {studentName}
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Student ID: {studentID}
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Score: {score} / {total}
      </Typography>

      <Typography variant="h4" sx={{ mb: 6 }}>
        {message}
      </Typography>

      <Button
        variant="contained"
        sx={{
          fontSize: "24px",
          px: 6,
          py: 2,
          borderRadius: "12px",
          background: "#ff4081",
          "&:hover": { background: "#f50057" },
        }}
        onClick={() => alert("You clicked me! 🎉")}
      >
        Click Me
      </Button>
    </Box>
  );
};

export default Result;
