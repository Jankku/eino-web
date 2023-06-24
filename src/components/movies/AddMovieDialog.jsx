import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Movie, { movieDefaults } from '../../models/Movie';
import { useAddMovie } from '../../data/movies/useAddMovie';
import PosterDialog from './PosterDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AddMovieDialog({ visible, closeDialog }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
  const formMethods = useForm({
    defaultValues: movieDefaults,
    resolver: zodResolver(Movie),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const addMovie = useAddMovie();

  const onSubmit = (formData) => {
    try {
      addMovie.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Movie created.');
        },
        onError: () => {
          showErrorSnackbar('Failed to create movie.');
        },
      });
      closeDialog();
      resetForm();
    } catch (error) {
      showErrorSnackbar('Failed to create movie.');
    }
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowPosters(false);
  };

  const onSelectPoster = (posterUrl) => {
    setValue('image_url', posterUrl);
    setShowPosters(false);
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Add new movie</DialogTitle>
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
            <Button type="submit" color="primary" disabled={addMovie.isLoading}>
              Create
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
