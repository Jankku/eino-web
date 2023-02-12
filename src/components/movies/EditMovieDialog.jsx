import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Movie from '../../models/Movie';
import { useUpdateMovie, useUpdateMovieFormData } from '../../data/movies/useUpdateMovie';

export default function EditMovieDialog({ visible, closeDialog, movieId }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadMovie = useUpdateMovieFormData(visible, movieId);
  const updateMovie = useUpdateMovie(movieId);

  useEffect(() => {
    setFormData(loadMovie.data);
  }, [loadMovie.data]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    try {
      const movie = Movie.parse(formData);
      updateMovie.mutate(movie, {
        onSuccess: () => {
          closeDialog();
          showSuccessSnackbar('Movie saved.');
        },
        onError: () => showErrorSnackbar('Failed to save movie.'),
      });
    } catch (error) {
      showErrorSnackbar('Failed to save movie.');
    }
  };

  const onCancel = () => closeDialog();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <BaseDialog open={visible} onClose={() => closeDialog()}>
      <DialogTitle>Edit movie</DialogTitle>
      <form onSubmit={onSubmitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {updateMovie.isLoading ? <LinearProgress /> : null}

          {formData ? (
            <MovieForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />
          ) : null}

          {loadMovie.isLoading ? (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : null}

          {loadMovie.isLoadingError ? (
            <Typography paragraph>Failed to load form data.</Typography>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loadMovie.isLoading || loadMovie.isLoadingError | updateMovie.isLoading}
            color="primary"
          >
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
