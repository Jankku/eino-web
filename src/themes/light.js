import { createTheme } from '@mui/material';
import { blue, blueGrey, red } from '@mui/material/colors';

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
  components: {
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
  },
});

export default light;
