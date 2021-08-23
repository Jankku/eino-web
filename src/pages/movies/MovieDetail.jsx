import {
  Button,
  capitalize,
  CircularProgress,
  Container,
  Grid,
  Paper,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState, useCallback, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useHistory, useParams } from 'react-router-dom';
import useToken from '../../utils/useToken';
import Header from '../../components/common/Header';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import MovieDetailItem from '../../components/movies/MovieDetailItem';
import MovieController from '../../data/MovieController';

export default function MovieDetail() {
  const history = useHistory();
  const { token } = useToken();
  const { movieId } = useParams();
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [movie, setMovie] = useState({});

  const fetchMovieDetails = useCallback(async () => {
    try {
      const res = await MovieController.getMovieDetails(movieId, token);
      setMovie(res.data.results[0]);
    } catch (err) {
      console.error(err);
    }
  }, [movieId, token]);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId, setMovie, token, fetchMovieDetails]);

  const saveMovie = async () => {
    try {
      await MovieController.updateMovie(movieId, token, movie);
      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async () => {
    try {
      await MovieController.deleteMovie(movieId, token);
      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <>
      <Header />
      <Container maxWidth="md">
        {movie.hasOwnProperty('movie_id') ? (
          <Paper sx={{ mt: 1.5, p: 2.5 }}>
            <Grid container columns={3} justifyContent="flex-start">
              <MovieDetailItem title="Title" text={movie.title} />
              <MovieDetailItem title="Studio" text={movie.studio} />
              <MovieDetailItem title="Director" text={movie.director} />
              <MovieDetailItem title="Writer" text={movie.writer} />
              <MovieDetailItem title="Duration" text={movie.duration} />
              <MovieDetailItem title="Year" text={movie.year} />
              <MovieDetailItem title="Status" text={capitalize(movie.status)} />
              <MovieDetailItem title="Score" text={movie.score} />
              <MovieDetailItem
                title="Start date"
                text={DateTime.fromISO(movie.start_date).toLocaleString()}
              />
              <MovieDetailItem
                title="End date"
                text={DateTime.fromISO(movie.end_date).toLocaleString()}
              />
            </Grid>
            <Grid container justifyContent="flex-start">
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditDialogOpen}
                startIcon={<CreateIcon />}
                sx={{ margin: '0.5em' }}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={saveMovie}
                startIcon={<SaveIcon />}
                sx={{ margin: '0.5em' }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteMovie}
                startIcon={<DeleteIcon />}
                sx={{ margin: '0.5em' }}
              >
                Delete
              </Button>
            </Grid>

            <EditMovieDialog
              visible={editDialogVisible}
              closeDialog={handleEditDialogCancel}
              movieId={movie.movie_id}
              submitAction={fetchMovieDetails}
            />
          </Paper>
        ) : (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
      </Container>
    </>
  );
}
