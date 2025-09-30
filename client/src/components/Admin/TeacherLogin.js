import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

function TeacherLogin() {
  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Teacher Login
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField label="Password" variant="outlined" type="password" fullWidth />
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default TeacherLogin;
