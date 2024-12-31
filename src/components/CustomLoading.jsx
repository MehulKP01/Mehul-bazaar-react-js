import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const CustomLoadingUI = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" color="white" sx={{ mt: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default CustomLoadingUI;