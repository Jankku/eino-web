import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/common/Header';
import { CircularProgress, Container, Fab, Grid, Select } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import MovieController from '../../data/MovieController';

const PREFIX = 'Movies';

const classes = {
  title: `${PREFIX}-title`,
  fab: `${PREFIX}-fab`,
  noMovies: `${PREFIX}-noMovies`,
};

const Root = styled('div')({
  [`& .${classes.title}`]: {
    marginBottom: '1em',
  },
  [`& .${classes.fab}`]: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
  },
  [`& .${classes.noMovies}`]: {
    fontWeight: 700,
  },
});

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [movieSortStatus, setMovieSortStatus] = useState('all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [isFetchingMovies, setisFetchingMovies] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMovies = async () => {
    try {
      setisFetchingMovies(true);

      const res = await MovieController.getMoviesByStatus(movieSortStatus);
      setMovies(res.data.results);

      setisFetchingMovies(false);
    } catch (err) {
      console.error(err);
      setisFetchingMovies(false);
    }
  };

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
    <Root>
      <Header />
      <Container maxWidth="md">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className={classes.title}
        >
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

        {isFetchingMovies ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : movies.length > 0 ? (
          <MovieList movies={movies} fetchMovies={fetchMovies} />
        ) : (
          <Grid container justifyContent="center">
            <p className={classes.noMovies}>No movies</p>
          </Grid>
        )}

        <AddMovieDialog
          visible={addDialogVisible}
          closeDialog={handleAddDialogCancel}
          submitAction={fetchMovies}
        />

        <Fab
          color="primary"
          aria-label="create"
          className={classes.fab}
          onClick={handleAddDialogOpen}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Root>
  );
}
