import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

function Contact() {
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>Contact</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        <TextField label="Name" fullWidth />
        <TextField label="Email" fullWidth />
        <TextField label="Message" multiline rows={4} fullWidth />
        <Button variant="contained" color="primary">Send</Button>
      </Box>
    </Container>
  );
}

export default Contact;
