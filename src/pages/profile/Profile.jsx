import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Stats from '../../components/profile/Stats';
import UserInfo from '../../components/profile/UserInfo';
import ProfileController from '../../data/ProfileController';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';

function Profile() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ProfileController.getProfile();
        setUserData(data);
      } catch (error) {
        showErrorSnackbar('Failed to fetch profile.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <h1>Profile</h1>
      {userData !== undefined ? (
        <>
          <Grid item>
            <UserInfo data={userData} />
          </Grid>
          <Grid item mt={2}>
            <Stats title="Book stats" stats={userData.stats.book} />
          </Grid>
          <Grid item mt={2}>
            <Stats title="Movie stats" stats={userData.stats.movie} />
          </Grid>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Profile;
