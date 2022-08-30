import { useState, useCallback, useEffect } from 'react';
import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import DetailItem from '../../components/common/DetailItem';
import MovieController from '../../data/MovieController';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';

export default function MovieDetail() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [movie, setMovie] = useState({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);

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

  const deleteMovie = async () => {
    try {
      await MovieController.deleteMovie(movieId);
      showSuccessSnackbar('Movie deleted.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      showErrorSnackbar('Failed to delete movie.');
    }
  };

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Container maxWidth="md">
      {Object.prototype.hasOwnProperty.call(movie, 'movie_id') ? (
        <Card
          sx={{
            mt: 3,
            border: 1,
            borderColor: 'primary.main',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Grid container columns={3} justifyContent="flex-start">
              <DetailItem title="Title" text={movie.title} />
              <DetailItem title="Studio" text={movie.studio} />
              <DetailItem title="Director" text={movie.director} />
              <DetailItem title="Writer" text={movie.writer} />
              <DetailItem title="Duration" text={`${movie.duration} minutes`} />
              <DetailItem title="Year" text={movie.year} />
              <DetailItem title="Status" text={capitalize(movie.status)} />
              <DetailItem title="Score" text={movie.score} />
              <DetailItem
                title="Start date"
                text={DateTime.fromISO(movie.start_date).toLocaleString()}
              />
              <DetailItem
                title="End date"
                text={DateTime.fromISO(movie.end_date).toLocaleString()}
              />
            </Grid>
          </CardContent>
          <CardActions sx={{ m: 0, pt: 0, pl: 2, pb: 3 }}>
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
                color="secondary"
                onClick={deleteMovie}
                startIcon={<DeleteIcon />}
                sx={{ margin: '0.5em' }}
              >
                Delete
              </Button>
            </Grid>
          </CardActions>
        </Card>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}

      <EditMovieDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        movieId={movie.movie_id}
        submitAction={fetchMovieDetails}
      />
    </Container>
  );
}
