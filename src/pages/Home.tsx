import { Container, ImageList, Typography } from '@mui/material';
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
import Head from '../components/common/Head';

export default function Home() {
  const columnCount = useColumnCalculator();

  return (
    <Container maxWidth="md">
      <Head pageTitle="Home" />
      <Typography
        component="h1"
        variant="h2"
        sx={{
          fontFamily: 'Pacifico, cursive',
          my: 2,
        }}
      >
        eino
      </Typography>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Book and movie tracker
      </Typography>
      <ImageList cols={columnCount} gap={12}>
        <InfoCard title="Authentication" icon={<LockOutlinedIcon />}>
          <InfoCardButton to="/register" icon={<VpnKeyIcon />}>
            Register
          </InfoCardButton>
          <InfoCardButton to="/login" icon={<LoginIcon />}>
            Login
          </InfoCardButton>
        </InfoCard>

        <InfoCard title="Features" icon={<LibraryBooksIcon />}>
          <Typography variant="body1">
            Keep track of books and movies you have enjoyed, save information about them and give
            ratings. On profile page you see statistics like score distribution graph, average score
            and hours watched etc.
          </Typography>
        </InfoCard>

        <InfoCard title="Source code" icon={<CodeIcon />}>
          <InfoCardButton to="https://github.com/jankku/eino-backend/" icon={<StorageIcon />}>
            Backend
          </InfoCardButton>

          <InfoCardButton to="https://github.com/jankku/eino-web/" icon={<WebIcon />}>
            Frontend
          </InfoCardButton>

          <InfoCardButton to="https://github.com/jankku/eino-android/" icon={<AndroidRounded />}>
            Android
          </InfoCardButton>
        </InfoCard>
      </ImageList>
    </Container>
  );
}
