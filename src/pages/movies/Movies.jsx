import { useReducer } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Container, Fab, Grid, Typography } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import { getMovies } from '../../data/Movie';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useQuery, useQueryClient } from 'react-query';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';

export default function Movies() {
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [sortStatus, setSortStatus] = useLocalStorage('movieSort', 'all');
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(['movies', sortStatus], () => getMovies(sortStatus), {
    initialData: () =>
      queryClient.getQueryData(['movies', 'all'])?.filter(({ status }) => status === sortStatus),
    onError: () => showErrorSnackbar("Couldn't fetch movies"),
  });
  const movieCount = data?.length ?? 0;

  const onSortStatusChange = (e) => setSortStatus(e.target.value);

  const onCopySuccess = () => showSuccessSnackbar('Items copied');
  const onCopyFailure = () => showErrorSnackbar('Failed to copy');

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Movies ({movieCount})</h1>
        </Grid>
        <Grid item>
          <CopyItemButton
            data={data}
            isDisabled={movieCount === 0}
            onSuccess={onCopySuccess}
            onFailure={onCopyFailure}
          />
          <SortStatusSelect status={sortStatus} onChange={onSortStatusChange}>
            {movieSortOptions.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
          </SortStatusSelect>
        </Grid>
      </Grid>

      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : data?.length > 0 ? (
        <MovieList movies={data} />
      ) : (
        <Grid container justifyContent="center">
          <Typography variant="h6">No movies found</Typography>
        </Grid>
      )}

      <AddMovieDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

      <Fab color="primary" aria-label="create" onClick={toggleAddDialog}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
