import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

function Help() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Instructor / Help
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Here you can find guidance for Admins, Teachers, and Students to get started.
      </Typography>

      <Box sx={{ textAlign: "left" }}>
        <List>
          <ListItem>
            <ListItemText primary="Admins: Use the Admin Dashboard to manage quizzes and users." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Teachers: Login to assign quizzes and review student submissions." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Students: Register and start quizzes from the Dashboard." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Contact support if you face any issues with login or registration." />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}

export default Help;
