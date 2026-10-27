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

export default function Settings() {
  const bookStatusId = useId();
  const movieStatusId = useId();
  const { showSuccessSnackbar } = useCustomSnackbar();
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
                    console.log(String(e.target.value));
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
      </Stack>
    </Container>
  );
}
