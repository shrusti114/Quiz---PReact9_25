import React from "react";
import { Container, Typography } from "@mui/material";

function About() {
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>About</Typography>
      <Typography variant="body1">
        This is a futuristic quiz/gaming platform for Students, Teachers, and Admins.
      </Typography>
    </Container>
  );
}

export default About;
