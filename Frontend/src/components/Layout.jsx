import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ChatBot from "./ChatBot"; 

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        overflow: "hidden", 
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1, 
          overflowX: "hidden", 
          overflowY: "auto", 
          paddingBottom: (theme) => `calc(${theme.spacing(5)} * 2)`, 
        }}
      >
        <Outlet />
      </Box>
      <ChatBot />
    </Box>
  );
};

export default Layout;