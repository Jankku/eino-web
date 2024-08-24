import { Container, Grid, Stack } from '@mui/material';
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
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <UserInfo
              username={data.username}
              email={data.email}
              registrationDate={data.registration_date}
            />
            <AccountActions email={data.email} />
          </Stack>
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
