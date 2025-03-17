// src/components/Loading.js
import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Loading;
