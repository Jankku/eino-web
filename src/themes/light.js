import { createTheme } from '@mui/material';
import { blue, red } from '@mui/material/colors';

const light = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#eee',
    },
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
    text: {
      link: blue[700],
    },
  },
});

export default light;
