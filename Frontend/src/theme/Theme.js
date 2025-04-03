import { createTheme } from '@mui/material/styles';
import logoWhite from '../../public/logos/LogoWhite.svg';
import darkBackground from '../../public/dark-bg.png'; // Import dark background
import lightBackground from '../../public/white-bg.png'; // Import light background


import logoBlack from '../../public/logos/LogoBlack.svg';
const shadows = {
  dark: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 5px 15px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.25), 0 6px 15px rgba(0, 0, 0, 0.15)',
  },
  light: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 5px 15px rgba(0, 0, 0, 0.05), 0 3px 8px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 15px rgba(0, 0, 0, 0.05)',
  }
};


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161821', // Dark navy blue background
      paper: '#21222c',   // Slightly lighter blue for cards and elements
    },
    text: {
      primary: '#FFFFFF', // Light grayish-blue text
      secondary: '#E2E8F0', // Muted blue-gray for less emphasis
      tertiary: '#94A3B8', // Pure white for contrast
    },
    primary: {
      main: '#a9dfd8', // Teal highlight color
    },
    secondary: {
      main: '#64748B', // Muted blue-gray
    },
    success: {
      main: 'rgba(169, 223, 216)', // Soft Teal with 20% opacity
      contrastText: '#ffffff', // Ensures contrast for readability
    },
    warning: {
      main: 'rgba(252, 184, 89)', // Warm Yellow with 20% opacity
      contrastText: '#000000', // Ensures contrast for readability
    },
    error: {
      main: 'rgba(242, 109, 91)', // Deep Coral with 20% opacity
      contrastText: '#ffffff', // Ensures contrast for readability
    },
    info: {
      main: 'rgba(40, 174, 243)', // Bright Blue with 20% opacity
      contrastText: '#ffffff', // Ensures contrast for readability
    },
    // Optional extra colors
    neutral: {
      main: 'rgba(242, 200, 237)', // Pastel Pink with 20% opacity
      contrastText: '#000000', // Ensures contrast for readability
    },
    highlight: {
      main: 'rgba(199, 162, 255)', // Soft Purple with 20% opacity
      contrastText: '#000000', // Ensures contrast for readability
    },
  },
  logo: {
    main: logoWhite, // Use white logo for dark theme
  },
  backgroundImage: {
    main: darkBackground,
    
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shadows: shadows.dark,
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
          backgroundColor: '#21222c',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#21222c', // Match the card background color
          color: '#E2E8F0', // Ensure text color is readable
        },
      },
    },
   
    MuiCssBaseline: {
      styleOverrides: `
        input[type="search"]::-webkit-search-cancel-button {
          filter: invert(60%) sepia(0%) saturate(0%) brightness(85%);
          cursor: pointer;
        }
        
        /* Autofill styles for dark mode */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #21222c inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        /* Make autofill inputs match theme */
        .MuiFormLabel-root {
          color: #E2E8F0;
        }
      `,
    },
  },
});

// New white theme
const whiteTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F8FAFC', // Very light blue-gray background
      paper: '#FFFFFF',   // Pure white for cards and elements
    },
    text: {
      primary: "#000000",
      secondary: '#1E293B', // Dark blue-gray for primary text
      tertiary: '#64748B', // Medium blue-gray for secondary text
    },
    primary: {
      main: '#4DA6A0', // Slightly darker teal to maintain contrast on white
    },
    secondary: {
      main: '#94A3B8', // Medium slate blue-gray
    },
    success: {
      main: 'rgba(139, 193, 187, 0.9)', // Deeper teal for better visibility on white
      contrastText: '#ffffff',
    },
    warning: {
      main: 'rgba(242, 164, 59, 0.9)', // Deeper orange-yellow
      contrastText: '#ffffff',
    },
    error: {
      main: 'rgba(222, 79, 61, 0.9)', // Deeper coral red
      contrastText: '#ffffff',
    },
    info: {
      main: 'rgba(20, 154, 223, 0.9)', // Deeper blue
      contrastText: '#ffffff',
    },
    // Optional extra colors
    neutral: {
      main: 'rgba(222, 180, 217, 0.9)', // Deeper pink
      contrastText: '#ffffff',
    },
    highlight: {
      main: 'rgba(179, 142, 235, 0.9)', // Deeper purple
      contrastText: '#ffffff',
    },
  },
  logo: {
    main: logoBlack, // Use black logo for light theme
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },

  shadows: shadows.light,
  backgroundImage: {
    main: lightBackground,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // Pure white cards
          color: '#1E293B',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '6px',
        },
        contained: {
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        input[type="search"]::-webkit-search-cancel-button {
          filter: invert(20%) sepia(10%) saturate(0%) brightness(90%);
          cursor: pointer;
        }
        
        /* Autofill styles for light mode */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #FFFFFF inset !important;
          -webkit-text-fill-color: #1E293B !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `,
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
        },
        head: {
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
  },
});

export { darkTheme, whiteTheme };
export default darkTheme;
