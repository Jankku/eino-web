import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Container, Fab, Grid, Select, Typography } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import { getMovies } from '../../data/Movie';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useQuery, useQueryClient } from 'react-query';

export default function Movies() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [movieSortStatus, setMovieSortStatus] = useLocalStorage('movieSort', 'all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ['movies', movieSortStatus],
    () => getMovies(movieSortStatus),
    {
      initialData: () => {
        const cachedMovies = queryClient
          .getQueryData(['movies', 'all'])
          ?.filter(({ status }) => status === movieSortStatus);
        return cachedMovies;
      },
      onError: () => showErrorSnackbar("Couldn't fetch movies"),
    }
  );

  const movieSortStatusChangeHandler = (e) => {
    setMovieSortStatus(e.target.value);
  };

  const handleAddDialogOpen = () => setAddDialogVisible(true);
  const handleAddDialogCancel = () => setAddDialogVisible(false);

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Movies</h1>
        </Grid>
        <Grid item>
          <Select
            native
            value={movieSortStatus}
            inputProps={{ name: 'movieSortStatus', id: 'movieSortStatus' }}
            onChange={movieSortStatusChangeHandler}
          >
            {movieSortOptions.map((item, itemIdx) => {
              return (
                <option key={itemIdx} value={item.value}>
                  {item.name}
                </option>
              );
            })}
          </Select>
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

      <AddMovieDialog visible={addDialogVisible} closeDialog={handleAddDialogCancel} />

      <Fab color="primary" aria-label="create" onClick={handleAddDialogOpen}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
