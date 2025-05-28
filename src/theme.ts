import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722', // Blue color for primary
    },
    secondary: {
      main: '#9c27b0', // Purple color for secondary
    },
    background: {
      default: '#FFFFFF', // Default background color
      paper: '#F5F5F5',
    },
    text: {
      primary: '#000000', // Text color
      secondary: '#757575', // Secondary text color
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif', // Default font family
    h1: {
      fontSize: '2.5rem', // Customize h1 font size
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem', // Default body text size
    },
  },
  spacing: 4, // Default spacing unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Set a custom border radius for all buttons
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '3rem', // Custom font size for h1
          color: '#1976d2', // Custom color for h1
        },
      },
    },
  },
});
