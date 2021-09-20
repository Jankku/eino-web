import { createTheme } from '@mui/material';
import { blue, red } from '@mui/material/colors';

const dark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#303030',
      paper: '#353535',
    },
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red[300],
    },
    text: {
      link: blue[300],
    },
  },
});

export default dark;
