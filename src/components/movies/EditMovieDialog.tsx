import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  GridLegacy,
  Typography,
} from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { movieSchema, getMovieDefaults, Movie } from '../../models/movie';
import { useUpdateMovie, useUpdateMovieFormData } from '../../data/movies/useUpdateMovie';
import PosterDialog from './PosterDialog';
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
    defaultValues: getMovieDefaults(),
    values: movieSchema.parse(loadMovie.data),
    resolver: zodResolver(movieSchema),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const updateMovie = useUpdateMovie(movieId);

  const onSubmit = (formData: Movie) => {
    updateMovie.mutate(formData, {
      onSuccess: () => {
        showSuccessSnackbar('Movie updated');
        closeDialog();
        resetForm();
      },
      onError: () => {
        showErrorSnackbar('Failed to save movie');
        closeDialog();
        resetForm();
      },
    });
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
              <GridLegacy
                container
                sx={{
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </GridLegacy>
            ) : null}

            {loadMovie.isLoadingError ? (
              <Typography component="p">Failed to load form data.</Typography>
            ) : null}

            <PosterDialog
              visible={showPosters}
              closeDialog={() => setShowPosters((prev) => !prev)}
              query={getValues('title')!}
              onSelect={onSelectPoster}
            />
          </DialogContent>

          <DialogActions>
            <Button color="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              loading={updateMovie.isPending}
              type="submit"
              disabled={loadMovie.isLoading || loadMovie.isLoadingError || updateMovie.isPending}
              color="primary"
            >
              Submit changes
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
