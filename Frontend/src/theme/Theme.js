import { createTheme } from '@mui/material/styles';
import logoWhite from '/logos/LogoWhite.svg';
import darkBackground from '/dark-bg.png'; // Import dark background
import lightBackground from '/white-bg.png'; // Import light background


import logoBlack from '/logos/LogoBlack.svg';
const shadowsArray = [
  'none', // Elevation 0
  '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12)', // Elevation 1
  '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px rgba(0, 0, 0, 0.12)', // Elevation 2
  '0px 1px 8px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 3px 3px rgba(0, 0, 0, 0.12)', // Elevation 3
  '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 3px 6px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.12)', // Elevation 4
  '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 4px 8px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)', // Elevation 5
  '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.14), 0px 1px 14px rgba(0, 0, 0, 0.12)', // Elevation 6
  '0px 4px 5px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)', // Elevation 7
  '0px 5px 5px rgba(0, 0, 0, 0.2), 0px 7px 10px rgba(0, 0, 0, 0.14), 0px 1px 22px rgba(0, 0, 0, 0.12)', // Elevation 8
  '0px 5px 6px rgba(0, 0, 0, 0.2), 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 1px 26px rgba(0, 0, 0, 0.12)', // Elevation 9
  '0px 6px 6px rgba(0, 0, 0, 0.2), 0px 9px 12px rgba(0, 0, 0, 0.14), 0px 1px 30px rgba(0, 0, 0, 0.12)', // Elevation 10
  '0px 6px 7px rgba(0, 0, 0, 0.2), 0px 10px 14px rgba(0, 0, 0, 0.14), 0px 1px 34px rgba(0, 0, 0, 0.12)', // Elevation 11
  '0px 7px 8px rgba(0, 0, 0, 0.2), 0px 11px 15px rgba(0, 0, 0, 0.14), 0px 1px 38px rgba(0, 0, 0, 0.12)', // Elevation 12
  '0px 8px 9px rgba(0, 0, 0, 0.2), 0px 12px 17px rgba(0, 0, 0, 0.14), 0px 1px 42px rgba(0, 0, 0, 0.12)', // Elevation 13
  '0px 9px 10px rgba(0, 0, 0, 0.2), 0px 13px 19px rgba(0, 0, 0, 0.14), 0px 1px 46px rgba(0, 0, 0, 0.12)', // Elevation 14
  '0px 10px 11px rgba(0, 0, 0, 0.2), 0px 14px 21px rgba(0, 0, 0, 0.14), 0px 1px 50px rgba(0, 0, 0, 0.12)', // Elevation 15
  '0px 11px 12px rgba(0, 0, 0, 0.2), 0px 15px 23px rgba(0, 0, 0, 0.14), 0px 1px 54px rgba(0, 0, 0, 0.12)', // Elevation 16
  '0px 12px 13px rgba(0, 0, 0, 0.2), 0px 16px 25px rgba(0, 0, 0, 0.14), 0px 1px 58px rgba(0, 0, 0, 0.12)', // Elevation 17
  '0px 13px 14px rgba(0, 0, 0, 0.2), 0px 17px 27px rgba(0, 0, 0, 0.14), 0px 1px 62px rgba(0, 0, 0, 0.12)', // Elevation 18
  '0px 14px 15px rgba(0, 0, 0, 0.2), 0px 18px 29px rgba(0, 0, 0, 0.14), 0px 1px 66px rgba(0, 0, 0, 0.12)', // Elevation 19
  '0px 15px 16px rgba(0, 0, 0, 0.2), 0px 19px 31px rgba(0, 0, 0, 0.14), 0px 1px 70px rgba(0, 0, 0, 0.12)', // Elevation 20
  '0px 16px 17px rgba(0, 0, 0, 0.2), 0px 20px 33px rgba(0, 0, 0, 0.14), 0px 1px 74px rgba(0, 0, 0, 0.12)', // Elevation 21
  '0px 17px 18px rgba(0, 0, 0, 0.2), 0px 21px 35px rgba(0, 0, 0, 0.14), 0px 1px 78px rgba(0, 0, 0, 0.12)', // Elevation 22
  '0px 18px 19px rgba(0, 0, 0, 0.2), 0px 22px 37px rgba(0, 0, 0, 0.14), 0px 1px 82px rgba(0, 0, 0, 0.12)', // Elevation 23
  '0px 19px 20px rgba(0, 0, 0, 0.2), 0px 23px 39px rgba(0, 0, 0, 0.14), 0px 1px 86px rgba(0, 0, 0, 0.12)', // Elevation 24
];


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
  shadows: shadowsArray,
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

  shadows: shadowsArray,
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