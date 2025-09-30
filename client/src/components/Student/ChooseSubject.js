import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack } from "@mui/material";

const ChooseSubject = () => {
  const navigate = useNavigate();

  const handleSubjectSelect = (department, subject) => {
    navigate("/student/quiz", { state: { department, subject } });
  };

  const subjects = {
    BCA: ["JavaScript", "React"],
    "MSc CA": ["Angular", "Python"],
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 6, fontWeight: "bold", textAlign: "center" }}
      >
        Select Department and Subject
      </Typography>

      {Object.keys(subjects).map((department) => (
        <Box key={department} sx={{ mb: 6, width: "100%", maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {department} Subjects
          </Typography>

          <Stack spacing={3}>
            {subjects[department].map((subject) => (
              <button
                key={subject}
                className="splash-button"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const circle = document.createElement("span");
                  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
                  const radius = diameter / 2;

                  circle.style.width = circle.style.height = `${diameter}px`;
                  circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
                  circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
                  circle.classList.add("ripple");

                  const ripple = btn.getElementsByClassName("ripple")[0];
                  if (ripple) ripple.remove();

                  btn.appendChild(circle);

                  // Navigate after animation
                  setTimeout(() => handleSubjectSelect(department, subject), 300);
                }}
              >
                {subject}
              </button>
            ))}
          </Stack>
        </Box>
      ))}

      <style>{`
        .splash-button {
          position: relative;
          padding: 12px 28px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          background: #1ee6dc;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s, background 0.3s;
        }
        .splash-button:hover {
          transform: scale(1.05);
          background: #00bcd4;
        }
        .splash-button:focus {
          outline: none;
        }
        .splash-button .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.7);
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default ChooseSubject;
