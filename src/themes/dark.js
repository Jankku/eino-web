import { blue, red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/system';

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
