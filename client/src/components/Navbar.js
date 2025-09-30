import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Quiz Dashboard</Typography>
        <div>
          <Button color="primary" onClick={() => navigate("/")}>Home</Button>
          <Button color="primary" onClick={() => navigate("/about")}>About</Button>
          <Button color="primary" onClick={() => navigate("/contact")}>Contact</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
