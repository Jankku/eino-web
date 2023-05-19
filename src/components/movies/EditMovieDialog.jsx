import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Movie from '../../models/Movie';
import { useUpdateMovie, useUpdateMovieFormData } from '../../data/movies/useUpdateMovie';
import PosterDialog from './PosterDialog';
import { LoadingButton } from '@mui/lab';

export default function EditMovieDialog({ visible, closeDialog, movieId }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
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

  const onSelectPoster = (posterUrl) => {
    setFormData({ ...formData, image_url: posterUrl });
    setShowPosters(false);
  };

  const onCancel = () => {
    closeDialog();
    setShowPosters(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Edit movie</DialogTitle>
      <form onSubmit={onSubmitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {formData ? (
            <MovieForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
              setShowPosters={setShowPosters}
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

          <PosterDialog
            visible={showPosters}
            closeDialog={() => setShowPosters((prev) => !prev)}
            query={formData?.title}
            onSelect={onSelectPoster}
          />
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton
            loading={updateMovie.isLoading}
            type="submit"
            disabled={loadMovie.isLoading || loadMovie.isLoadingError || updateMovie.isLoading}
            color="primary"
          >
            Submit changes
          </LoadingButton>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
