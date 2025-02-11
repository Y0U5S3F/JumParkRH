import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { makeStyles } from "@mui/styles";

// Styles with makeStyles
const useStyles = makeStyles((theme) => ({
  layoutContainer: {
    display: "flex",
  },
}));

const Layout = () => {
  const classes = useStyles();

  return (
    <div className={classes.layoutContainer}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
