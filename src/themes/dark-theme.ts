import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
    },
    primary: {
      main: '#fc9344',
      
    },
    secondary: {
      main: '#1E1E1E'
    },
    text: {
      primary: '#FFF'
    },
    error: {
      main: red.A400
    },
  },

  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          // backgroundColor: '#4a148c'
        }
      }
    },

    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'medium',
        disableElevation: true,
        color: 'primary',
      },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          boxShadow: 'none',
          backgroundColor: 'primary',
          borderRadius: 10,
          ":hover": {
            backgroundColor: 'primary',
            transition: 'all 0.3s ease-in-out'
          }
        }
      }
    },

    MuiCardMedia: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF'
        }
      }
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingBottom: 6,
          paddingTop: 6,
        }
      }
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600
        },
        h2: {
          fontSize: 20,
          fontWeight: 400
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600
        }
      }
    },
  }
});