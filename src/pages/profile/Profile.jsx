import { Container, Grid } from '@mui/material';
import { AccountActions } from '../../components/profile/AccountActions';
import { Stats } from '../../components/profile/stats/Stats';
import { UserInfo } from '../../components/profile/UserInfo';
import { useProfile } from '../../data/profile/useProfile';

export default function Profile() {
  const { data } = useProfile();

  return (
    <Container maxWidth="md" sx={{ paddingBottom: 4 }}>
      <h1>Profile</h1>

      {data ? (
        <>
          <Grid container gap={2}>
            <UserInfo data={data} />
            <AccountActions />
          </Grid>
          <Grid item mt={2}>
            <Stats type="book" stats={data.stats.book} />
          </Grid>
          <Grid item mt={2}>
            <Stats type="movie" stats={data.stats.movie} />
          </Grid>
        </>
      ) : null}
    </Container>
  );
}
