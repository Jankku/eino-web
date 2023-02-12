import { Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import AccountActions from '../../components/profile/AccountActions';
import Stats from '../../components/profile/Stats';
import UserInfo from '../../components/profile/UserInfo';
import { useProfile } from '../../data/profile/useProfile';

function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data } = useProfile();

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
      ) : null}
    </Container>
  );
}

export default Profile;
