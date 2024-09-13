import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { movieSchema, movieDefaults, Movie } from '../../models/movie';
import { useUpdateMovie, useUpdateMovieFormData } from '../../data/movies/useUpdateMovie';
import PosterDialog from './PosterDialog';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type EditMovieDialogProps = {
  visible: boolean;
  closeDialog: () => void;
  movieId: string;
};

export default function EditMovieDialog({ visible, closeDialog, movieId }: EditMovieDialogProps) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
  const loadMovie = useUpdateMovieFormData(visible, movieId);
  const formMethods = useForm({
    defaultValues: movieDefaults,
    values: movieSchema.parse(loadMovie.data),
    resolver: zodResolver(movieSchema),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const updateMovie = useUpdateMovie(movieId);

  const onSubmit = (formData: Movie) => {
    try {
      updateMovie.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Movie saved');
        },
        onError: () => showErrorSnackbar('Failed to save movie'),
      });
      closeDialog();
      resetForm();
    } catch {
      showErrorSnackbar('Failed to save movie');
    }
  };

  const onSelectPoster = (posterUrl: string) => {
    setValue('image_url', posterUrl);
    setShowPosters(false);
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowPosters(false);
  };

  return (
    <BaseDialog title="Edit movie" open={visible} onClose={onCancel}>
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
              loading={updateMovie.isPending}
              type="submit"
              disabled={loadMovie.isLoading || loadMovie.isLoadingError || updateMovie.isPending}
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
