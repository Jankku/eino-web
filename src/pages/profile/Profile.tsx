import { Box, Container, Stack } from '@mui/material';
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
      <Box mb={2}>
        <UserInfo
          username={data.username}
          email={data.email}
          emailVerifiedOn={data.email_verified_on}
          registrationDate={data.registration_date}
          profilePicturePath={data.profile_picture_path}
          totpEnabledOn={data.totp_enabled_on}
        />
      </Box>
      <Stack spacing={2}>
        <BookStats stats={data.stats.book} />
        <MovieStats stats={data.stats.movie} />
      </Stack>
    </Container>
  );
}
