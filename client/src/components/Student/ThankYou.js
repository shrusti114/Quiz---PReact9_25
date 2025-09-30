import React from "react";
import { Box, Typography } from "@mui/material";

const ThankYou = () => (
  <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#add8e6" }}>
    <Typography variant="h4" sx={{ color: "black" }}>
      Thank you for completing the quiz!
    </Typography>
  </Box>
);

export default ThankYou;
