import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  capitalize,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import MovieDetailItem from '../../components/movies/MovieDetailItem';
import MovieController from '../../data/MovieController';

export default function MovieDetail() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [movie, setMovie] = useState({});

  const fetchMovieDetails = useCallback(async () => {
    try {
      const res = await MovieController.getMovieDetails(movieId);
      setMovie(res.data.results[0]);
    } catch (err) {
      console.error(err);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId, setMovie, fetchMovieDetails]);

  const saveMovie = async () => {
    try {
      await MovieController.updateMovie(movieId, movie);
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async () => {
    try {
      await MovieController.deleteMovie(movieId);
      navigate(-1);
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
          <Card
            sx={{
              mt: 3,
              border: 1,
              borderColor: 'primary.main',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Grid container columns={3} justifyContent="flex-start">
                <MovieDetailItem title="Title" text={movie.title} />
                <MovieDetailItem title="Studio" text={movie.studio} />
                <MovieDetailItem title="Director" text={movie.director} />
                <MovieDetailItem title="Writer" text={movie.writer} />
                <MovieDetailItem
                  title="Duration"
                  text={`${movie.duration} minutes`}
                />
                <MovieDetailItem title="Year" text={movie.year} />
                <MovieDetailItem
                  title="Status"
                  text={capitalize(movie.status)}
                />
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
            </CardContent>
          </Card>
        ) : (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
      </Container>
    </>
  );
}
