import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Display Image */}
      <img
        src="https://cdn.discordapp.com/attachments/1339526219456184385/1341701507921215519/Screenshot_2025-02-19_at_10.22.34_AM.png?ex=67b6f467&is=67b5a2e7&hm=325f69b4a67c941bbe2d15b4db4ff164adba967064a2a1186c105edb710659a7&"
        alt="Dashboard image"
        style={{ width: "75%", aspectRatio: "1.5" }}
      />
    </Box>
  );
};

export default Dashboard;