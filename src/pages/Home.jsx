import { Container, ImageList, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useColumnCalculator } from '../hooks/useColumnCalculator';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CodeIcon from '@mui/icons-material/Code';
import AndroidRounded from '@mui/icons-material/AndroidRounded';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import InfoCard from '../components/home/InfoCard';
import InfoCardButton from '../components/home/InfoCardButton';

export default function Home() {
  const columnCount = useColumnCalculator();

  return (
    <Container maxWidth="md">
      <Typography
        variant="h1"
        sx={{
          typography: 'h2',
          margin: '0.3em 0em',
          fontFamily: 'Pacifico, cursive',
        }}
      >
        eino
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: '700' }}>
        Book and movie tracker
      </Typography>

      <ImageList cols={columnCount} gap={12}>
        <InfoCard title="Authentication" icon={<LockOutlinedIcon />}>
          <Link to="/register">
            <InfoCardButton icon={<VpnKeyIcon />}>Register</InfoCardButton>
          </Link>
          <Link to="/login">
            <InfoCardButton icon={<LoginIcon />}>Login</InfoCardButton>
          </Link>
        </InfoCard>

        <InfoCard title="Features" icon={<LibraryBooksIcon />}>
          <Typography variant="body1">
            Keep track of books and movies you have enjoyed, save information about them and give
            ratings. On profile page you see statistics like score distribution graph, average score
            and hours watched etc.
          </Typography>
        </InfoCard>

        <InfoCard title="Source code" icon={<CodeIcon />}>
          <a href="https://github.com/jankku/eino-backend/" rel="noreferrer">
            <InfoCardButton icon={<StorageIcon />}>Backend</InfoCardButton>
          </a>

          <a href="https://github.com/jankku/eino-web/" rel="noreferrer">
            <InfoCardButton icon={<WebIcon />}>Frontend</InfoCardButton>
          </a>

          <a href="https://github.com/jankku/eino-android/" rel="noreferrer">
            <InfoCardButton icon={<AndroidRounded />}>Android</InfoCardButton>
          </a>
        </InfoCard>
      </ImageList>
    </Container>
  );
}
