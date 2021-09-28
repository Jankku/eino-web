import { Container, ImageList } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Header from '../components/common/Header';
import InfoBox from '../components/home/InfoBox';
import ColumnCalculator from '../utils/ColumnCalculator';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CodeIcon from '@mui/icons-material/Code';

const infoBoxData = [
  {
    title: 'Authentication',
    text: '',
    icon: <LockOutlinedIcon />,
    button: {
      linkText: 'Register',
      link: '/register',
      target: '_self',
      icon: <VpnKeyIcon />,
    },
    button2: {
      linkText: 'Login',
      link: '/login',
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
    text: 'Frontend and backend code of the project is on GitHub.',
    icon: <CodeIcon />,
    button: {
      linkText: 'GitHub',
      link: 'https://github.com/jankku/eino-web/',
      target: '_blank',
      icon: <GitHubIcon />,
    },
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Box
          sx={{
            typography: 'h3',
            margin: '0.3em 0em',
            fontFamily: 'Pacifico, cursive',
            letterSpacing: '0.03em',
          }}
        >
          eino
        </Box>
        <Box sx={{ typography: 'h6' }}>Book and movie tracker</Box>
        <ImageList cols={ColumnCalculator()} gap={12}>
          {infoBoxData.map((box, boxIdx) => (
            <InfoBox key={boxIdx}>{box}</InfoBox>
          ))}
        </ImageList>
      </Container>
    </>
  );
}
