import { useState } from 'react';
import { Button, DialogActions, DialogContent } from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { movieSchema, getMovieDefaults, Movie } from '../../models/movie';
import { useAddMovie } from '../../data/movies/useAddMovie';
import PosterDialog from './PosterDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type AddMovieDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function AddMovieDialog({ visible, closeDialog }: AddMovieDialogProps) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
  const formMethods = useForm({
    defaultValues: getMovieDefaults(),
    resolver: zodResolver(movieSchema),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const addMovie = useAddMovie();

  const onSubmit = (formData: Movie) => {
    try {
      addMovie.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Movie created');
        },
        onError: () => {
          showErrorSnackbar('Failed to create movie');
        },
      });
      closeDialog();
      resetForm();
    } catch {
      showErrorSnackbar('Failed to create movie');
    }
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowPosters(false);
  };

  const onSelectPoster = (posterUrl: string) => {
    setValue('image_url', posterUrl);
    setShowPosters(false);
  };

  return (
    <BaseDialog title="Create movie" open={visible} onClose={onCancel}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <MovieForm onShowPosters={() => setShowPosters(true)} />

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
            <Button type="submit" color="primary" disabled={addMovie.isPending}>
              Create
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
