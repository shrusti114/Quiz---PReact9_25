// RolePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";

function RolePage() {
  const navigate = useNavigate();

  const handleRoleClick = (tableName) => {
    navigate("/login", { state: { tableName } });
  };

  return (
    <Container sx={{ mt: 5 }}>
      {/* Page Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Select Your Role
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        gutterBottom
        sx={{ color: "text.secondary", mb: 4 }}
      >
        Choose whether you are an Admin, Teacher, or Student to continue
      </Typography>

      {/* Role Options */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Paper
            onClick={() => handleRoleClick("admin_mst")}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#e3f2fd",
              borderRadius: 3,
              boxShadow: 3,
              "&:hover": { bgcolor: "#bbdefb" },
            }}
          >
            <Typography variant="h6">👨‍💼 Admin</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Manage users, quizzes, and overall system.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            onClick={() => handleRoleClick("teacher_info")}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#f1f8e9",
              borderRadius: 3,
              boxShadow: 3,
              "&:hover": { bgcolor: "#dcedc8" },
            }}
          >
            <Typography variant="h6">👩‍🏫 Teacher</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Create quizzes and monitor student progress.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            onClick={() => handleRoleClick("student_info")}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#fff8e1",
              borderRadius: 3,
              boxShadow: 3,
              "&:hover": { bgcolor: "#ffe082" },
            }}
          >
            <Typography variant="h6">👩‍🎓 Student</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Attempt quizzes and check results.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: "center", color: "gray" }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} IT Quiz App
        </Typography>
      </Box>
    </Container>
  );
}

export default RolePage;
