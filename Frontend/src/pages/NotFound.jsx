import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="background.default"
      color="text.primary"
      p={4}
    >
      <Container maxWidth="sm" style={{ textAlign: "center" }}>
        <Typography
          variant="h1"
          component="h2"
          fontWeight="bold"
          color="text.secondary"
          gutterBottom
        >
          404
        </Typography>
        <Typography variant="h4" fontWeight="medium" gutterBottom>
          Désolé, nous n'avons pas pu trouver cette page.
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Mais ne vous inquiétez pas, vous pouvez trouver plein d'autres choses sur notre page d'accueil.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
        >
          Retour à la page d'accueil
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;