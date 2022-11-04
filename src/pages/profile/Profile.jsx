import {
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQuery } from 'react-query';
import AccountActions from '../../components/profile/AccountActions';
import Stats from '../../components/profile/Stats';
import UserInfo from '../../components/profile/UserInfo';
import { getProfile } from '../../data/Profile';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';

function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showErrorSnackbar } = useCustomSnackbar();
  const { data, isError } = useQuery(['profile'], getProfile, {
    onError: () => {
      showErrorSnackbar('Failed to load profile');
    },
  });

  return (
    <Container maxWidth="md">
      <h1>Profile</h1>

      {data ? (
        <>
          <Grid container={!isMobile}>
            <UserInfo data={data} />
            <AccountActions />
          </Grid>
          <Grid item mt={2}>
            <Stats title="Book stats" stats={data.stats.book} />
          </Grid>
          <Grid item mt={2}>
            <Stats title="Movie stats" stats={data.stats.movie} />
          </Grid>
        </>
      ) : isError ? (
        <Grid container justifyContent="center">
          <Typography paragraph>Failed to load profile</Typography>
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
    </Container>
  );
}

export default Profile;
