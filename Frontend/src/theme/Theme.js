import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161821', // Dark navy blue background
      paper: '#161821',   // Slightly lighter blue for cards and elements
    },
    text: {
      primary: '#E2E8F0', // Light grayish-blue text
      secondary: '#94A3B8', // Muted blue-gray for less emphasis
    },
    primary: {
      main: '#a9dfd8', // Teal highlight color
    },
    secondary: {
      main: '#64748B', // Muted blue-gray
    },
    success: {
      main: '#22C55E', // Green color used in profit indicators
    },
    warning: {
      main: '#FACC15', // Yellow highlight color
    },
    error: {
      main: '#EF4444', // Red error color
    },
    info: {
      main: '#3B82F6', // Blue for information highlights
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#21222c', // Ensures cards match the UI
          color: '#E2E8F0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161821',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000', // Match the card background color
          color: '#E2E8F0', // Ensure text color is readable
        },
      },
    },
  },
});

export default darkTheme;