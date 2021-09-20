import { createTheme } from '@mui/material';
import { blue, red } from '@mui/material/colors';

const light = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#DDD',
      paper: '#EEE',
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
