import { Container, ImageList, Typography } from '@mui/material';
import InfoBox from '../components/home/InfoBox';
import ColumnCalculator from '../utils/ColumnCalculator';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CodeIcon from '@mui/icons-material/Code';
import AndroidRounded from '@mui/icons-material/AndroidRounded';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';

const infoBoxData = [
  {
    title: 'Authentication',
    text: '',
    icon: <LockOutlinedIcon />,
    button: {
      linkText: 'Register',
      path: '/register',
      target: '_self',
      icon: <VpnKeyIcon />,
    },
    button2: {
      linkText: 'Login',
      path: '/login',
      target: '_self',
      icon: <LoginIcon />,
    },
  },
  {
    title: 'Features',
    text: 'Keep track of books and movies you have enjoyed, save information about them and give scores.',
    icon: <LibraryBooksIcon />,
  },
  {
    title: 'Source code',
    icon: <CodeIcon />,
    button: {
      linkText: 'Backend',
      link: 'https://github.com/jankku/eino-backend/',
      target: '_blank',
      icon: <StorageIcon />,
    },
    button2: {
      linkText: 'Frontend',
      link: 'https://github.com/jankku/eino-web/',
      target: '_blank',
      icon: <WebIcon />,
    },
    button3: {
      linkText: 'Android',
      link: 'https://github.com/jankku/eino-android/',
      target: '_blank',
      icon: <AndroidRounded />,
    },
  },
];

export default function Home() {
  return (
    <Container maxWidth="md">
      <Typography
        variant="h1"
        sx={{
          typography: 'h3',
          margin: '0.3em 0em',
          fontFamily: 'Pacifico, cursive',
          letterSpacing: '0.03em',
        }}
      >
        eino
      </Typography>
      <Typography variant="h6">Book and movie tracker</Typography>
      <ImageList cols={ColumnCalculator()} gap={12}>
        {infoBoxData.map((box, boxIdx) => (
          <InfoBox key={boxIdx}>{box}</InfoBox>
        ))}
      </ImageList>
    </Container>
  );
}
