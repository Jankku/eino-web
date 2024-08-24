import { Container, Grid } from '@mui/material';
import { AccountActions } from '../../components/profile/AccountActions';
import { BookStats } from '../../components/profile/stats/BookStats';
import { MovieStats } from '../../components/profile/stats/MovieStats';
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
            <UserInfo username={data.username} registrationDate={data.registration_date} />
            <AccountActions />
          </Grid>
          <Grid item mt={2}>
            <BookStats stats={data.stats.book} />
          </Grid>
          <Grid item mt={2}>
            <MovieStats stats={data.stats.movie} />
          </Grid>
        </>
      ) : null}
    </Container>
  );
}
