import { createTheme } from '@mui/material';
import { blue, red } from '@mui/material/colors';

const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
      paper: '#2d2d2d',
    },
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red[300],
    },
    text: {
      primary: '#DDD',
      link: blue[300],
    },
  },
});

export default dark;
