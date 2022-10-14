import { CircularProgress, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
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
  const { isLoading, data } = useQuery('profile', getProfile, {
    onError: () => {
      showErrorSnackbar('Failed to load profile');
    },
  });

  return (
    <Container maxWidth="md">
      <h1>Profile</h1>

      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : null}

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
      ) : null}
    </Container>
  );
}

export default Profile;
