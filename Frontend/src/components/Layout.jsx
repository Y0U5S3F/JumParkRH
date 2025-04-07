import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ChatBot from "./ChatBot"; // Import ChatBot component

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        overflow: "hidden", // Prevent horizontal scrolling
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1, // Allow the content to grow and fill the remaining space
          overflowX: "hidden", // Prevent horizontal scrolling in the content area
          overflowY: "auto", // Allow vertical scrolling if content overflows
        }}
      >
        <Outlet />
      </Box>
      <ChatBot />
    </Box>
  );
};

export default Layout;