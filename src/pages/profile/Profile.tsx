import { Container, Grid, Stack } from '@mui/material';
import { AccountActions } from '../../components/profile/AccountActions';
import { BookStats } from '../../components/profile/stats/BookStats';
import { MovieStats } from '../../components/profile/stats/MovieStats';
import { UserInfo } from '../../components/profile/UserInfo';
import { useProfile } from '../../data/profile/useProfile';
import Head from '../../components/common/Head';

export default function Profile() {
  const { data } = useProfile();

  return (
    <Container maxWidth="md" sx={{ paddingBottom: 4 }}>
      <Head pageTitle="Profile" />
      <h1>Profile</h1>
      {data ? (
        <>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <UserInfo
              username={data.username}
              email={data.email}
              emailVerifiedOn={data.email_verified_on}
              registrationDate={data.registration_date}
              profilePicturePath={data.profile_picture_path}
              totpEnabledOn={data.totp_enabled_on}
            />
            <AccountActions
              email={data.email}
              emailVerifiedOn={data.email_verified_on}
              totpEnabledOn={data.totp_enabled_on}
            />
          </Stack>
          <Grid
            item
            sx={{
              mt: 2,
            }}
          >
            <BookStats stats={data.stats.book} />
          </Grid>
          <Grid
            item
            sx={{
              mt: 2,
            }}
          >
            <MovieStats stats={data.stats.movie} />
          </Grid>
        </>
      ) : null}
    </Container>
  );
}
