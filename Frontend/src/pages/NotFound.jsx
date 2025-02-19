import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  useEffect(() => {
    // Dynamically load the Tenor script
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        Page Not Found
      </Typography>
      
      {/* Tenor GIF Embed */}
      <div
        className="tenor-gif-embed"
        data-postid="15757370"
        data-share-method="host"
        data-aspect-ratio="0.55625"
        data-width="20%"
      >
        <a href="https://tenor.com/view/ouuuh-ouuh-what-confused-gif-15757370">
          Ouuuh Ouuh What GIF
        </a>
        from 
        <a href="https://tenor.com/search/ouuuh+ouuh-gifs">
          Ouuuh Ouuh GIFs
        </a>
      </div>
    </Box>
  );
};

export default NotFound;
