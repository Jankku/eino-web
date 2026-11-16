import { useId } from 'react';
import { Button, Container, FormControl, InputLabel, Select, Stack } from '@mui/material';
import Head from '../components/common/Head';
import SettingsCard from '../components/settings/SettingsCard';
import { useCustomSnackbar } from '../hooks/useCustomSnackbar';
import { bookStatus } from '../models/bookStatus';
import { movieStatus } from '../models/movieStatus';
import { Book } from '../models/book';
import { Movie } from '../models/movie';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router';
import { useLogoutAll } from '../data/auth/useLogoutAll';
import { useDoubleCheck } from '../hooks/useDoubleCheck';
import { parseError } from '../utils/zodUtil';

export default function Settings() {
  const bookStatusId = useId();
  const movieStatusId = useId();
  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const logoutAll = useLogoutAll();
  const { doubleCheck: confirmLogoutAll, getButtonProps: getLogoutAllButtonProps } =
    useDoubleCheck();
  const [newBookStatus, setNewBookStatus] = useLocalStorage<Book['status']>(
    'newBookStatus',
    'planned',
  );
  const [newMovieStatus, setNewMovieStatus] = useLocalStorage<Movie['status']>(
    'newMovieStatus',
    'planned',
  );

  const clearClosedBulletins = () => {
    localStorage.removeItem('closedBulletins');
    window.dispatchEvent(new Event('storage'));
    showSuccessSnackbar('Closed bulletins cleared');
  };

  const onLogoutAll = () => {
    logoutAll.mutate(undefined, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
        // The current tokens are revoked too, so finish with the normal logout.
        navigate('/logout');
      },
      onError: async (error) => {
        const errors = parseError(error);
        showErrorSnackbar(errors[0].message);
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Head pageTitle="Settings" />
      <h1>Settings</h1>
      <Stack spacing={3}>
        <SettingsCard
          title="Clear closed bulletins"
          message="If you accidentally closed a bulletin, you can make it visible again."
          actions={
            <Button color="secondary" variant="contained" onClick={clearClosedBulletins}>
              Clear
            </Button>
          }
        />
        <SettingsCard
          actionsAsRow
          title="Default status"
          message="Change the default status for new books and movies."
          actions={
            <>
              <FormControl fullWidth>
                <InputLabel htmlFor={bookStatusId}>Book status</InputLabel>
                <Select
                  native
                  label="Book status"
                  inputProps={{ id: bookStatusId }}
                  defaultValue={newBookStatus}
                  onChange={(e) => {
                    setNewBookStatus(e.target.value as Book['status']);
                  }}
                >
                  {bookStatus.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor={movieStatusId}>Movie status</InputLabel>
                <Select
                  native
                  label="Movie status"
                  inputProps={{ id: movieStatusId }}
                  defaultValue={newMovieStatus}
                  onChange={(e) => setNewMovieStatus(e.target.value as Movie['status'])}
                >
                  {movieStatus.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          }
        />
        <SettingsCard
          title="Log out of all devices"
          message="End every session of your account, including this one. You need to log in again on each device."
          actions={
            <Button
              color="secondary"
              variant="contained"
              loading={logoutAll.isPending}
              {...getLogoutAllButtonProps({ onClick: onLogoutAll })}
            >
              {confirmLogoutAll ? 'You sure?' : 'Log out all'}
            </Button>
          }
        />
      </Stack>
    </Container>
  );
}
