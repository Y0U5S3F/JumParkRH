import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material"; // Use MUI Box for better flexibility
import { makeStyles } from "@mui/styles";

// Styles with makeStyles
const useStyles = makeStyles((theme) => ({
  layoutContainer: {
    display: "flex",
    minHeight: "100vh",  // Ensure the layout takes the full height of the viewport
    flexDirection: "row",  // Align children (Navbar and Outlet) horizontally
  },
  content: {
    flexGrow: 1,  // Take the remaining space
  },
}));

const Layout = () => {
  const classes = useStyles();

  return (
    <Box className={classes.layoutContainer}>
      <Navbar /> {/* Sidebar Drawer */}
      <Box className={classes.content}>
        <Outlet /> {/* Page Content */}
      </Box>
    </Box>
  );
};

export default Layout;
