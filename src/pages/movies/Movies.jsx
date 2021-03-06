import { useState, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Container, Fab, Grid, Select, Typography } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import MovieController from '../../data/MovieController';
import useCustomSnackbar from '../../utils/useCustomSnackbar';

export default function Movies() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [movies, setMovies] = useState([]);
  const [movieSortStatus, setMovieSortStatus] = useState('all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await MovieController.getMoviesByStatus(movieSortStatus);
      setMovies(res.data.results);
    } catch (err) {
      showErrorSnackbar('Failed to fetch movies.');
    }
    setIsFetching(false);
  }, [movieSortStatus, showErrorSnackbar]);

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieSortStatus]);

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

      {isFetching ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : movies.length > 0 ? (
        <MovieList movies={movies} fetchMovies={fetchMovies} />
      ) : (
        <Grid container justifyContent="center">
          <Typography paragraph sx={{ fontWeight: 700 }}>
            No movies
          </Typography>
        </Grid>
      )}

      <AddMovieDialog
        visible={addDialogVisible}
        closeDialog={handleAddDialogCancel}
        submitAction={fetchMovies}
      />

      <Fab color="primary" aria-label="create" onClick={handleAddDialogOpen}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
