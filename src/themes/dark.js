import { createTheme } from '@mui/material';
import { blue, blueGrey, red } from '@mui/material/colors';

const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#191b21',
      paper: '#191b21',
    },
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red[300],
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          position: 'fixed',
          bottom: '16px',
          right: '16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '0.3em 0em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#25272c',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#FFF',
          margin: '0.5em 0em',
          borderRadius: 6,
        },
      },
    },
  },
});

export default dark;
