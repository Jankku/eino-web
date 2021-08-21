import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Header from '../common/Header';
import axios from '../../axios';
import {
  CircularProgress,
  Container,
  Fab,
  Grid,
  Select,
} from '@material-ui/core';
import AddMovieDialog from './AddMovieDialog';
import MovieList from './MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import useToken from '../../utils/useToken';

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
  const { token } = useToken();

  const [movies, setMovies] = useState([]);
  const [movieSortStatus, setMovieSortStatus] = useState('all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [isFetchingMovies, setisFetchingMovies] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMovies = async () => {
    setisFetchingMovies(true);

    try {
      const res = await axios({
        method: 'get',
        url: `/api/list/movies/${movieSortStatus}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

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

  const handleAddDialogOpen = () => {
    setAddDialogVisible(true);
  };

  const handleAddDialogCancel = () => {
    setAddDialogVisible(false);
  };

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
          fetchMovies={fetchMovies}
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
