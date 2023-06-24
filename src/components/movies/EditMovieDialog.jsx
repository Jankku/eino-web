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
import Movie, { movieDefaults } from '../../models/Movie';
import { useUpdateMovie, useUpdateMovieFormData } from '../../data/movies/useUpdateMovie';
import PosterDialog from './PosterDialog';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function EditMovieDialog({ visible, closeDialog, movieId }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
  const formMethods = useForm({
    defaultValues: movieDefaults,
    resolver: zodResolver(Movie),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const loadMovie = useUpdateMovieFormData(visible, movieId);
  const updateMovie = useUpdateMovie(movieId);

  useEffect(() => {
    resetForm(Movie.parse(loadMovie.data));
  }, [loadMovie.data, resetForm]);

  const onSubmit = (formData) => {
    try {
      updateMovie.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Movie saved.');
        },
        onError: () => showErrorSnackbar('Failed to save movie.'),
      });
      closeDialog();
      resetForm();
    } catch (error) {
      showErrorSnackbar('Failed to save movie.');
    }
  };

  const onSelectPoster = (posterUrl) => {
    setValue('image_url', posterUrl);
    setShowPosters(false);
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowPosters(false);
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Edit movie</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <MovieForm onShowPosters={() => setShowPosters(true)} />

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
              query={getValues('title')}
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
      </FormProvider>
    </BaseDialog>
  );
}
