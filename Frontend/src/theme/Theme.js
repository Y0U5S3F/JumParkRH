import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',  // Enables dark mode
    background: {
      default: '#121212',  // Dark background
      paper: '#1E1E1E',  // Background for elements like cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
});

export default darkTheme;
