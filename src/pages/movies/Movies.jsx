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

export default function Movies() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [sortStatus, setSortStatus] = useLocalStorage('movieSort', 'all');
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(['movies', sortStatus], () => getMovies(sortStatus), {
    initialData: () =>
      queryClient.getQueryData(['movies', 'all'])?.filter(({ status }) => status === sortStatus),
    onError: () => showErrorSnackbar("Couldn't fetch movies"),
  });

  const onSortStatusChange = (e) => setSortStatus(e.target.value);

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Movies</h1>
        </Grid>
        <Grid item>
          <SortStatusSelect status={sortStatus} onChange={onSortStatusChange}>
            {movieSortOptions.map((item, itemIdx) => {
              return (
                <option key={itemIdx} value={item.value}>
                  {item.name}
                </option>
              );
            })}
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
