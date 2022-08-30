import { createTheme } from '@mui/material';
import { blue, red } from '@mui/material/colors';

const light = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#edf8ff',
      paper: '#FFF',
    },
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: 'fonts.css',
    },
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#000',
          margin: '0.5em 0em',
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          alignSelf: 'end',
        },
      },
    },
  },
});

export default light;
