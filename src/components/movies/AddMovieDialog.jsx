import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import initialMovieState from '../../models/initialMovieState';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Movie from '../../models/Movie';
import { useAddMovie } from '../../data/movies/useAddMovie';
import PosterDialog from './PosterDialog';

export default function AddMovieDialog({ visible, closeDialog }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showPosters, setShowPosters] = useState(false);
  const [formData, setFormData] = useState(initialMovieState);
  const addMovie = useAddMovie();

  const submitForm = (e) => {
    e.preventDefault();
    try {
      const movie = Movie.parse(formData);
      addMovie.mutate(movie, {
        onSuccess: () => {
          showSuccessSnackbar('Movie created.');
        },
        onError: () => {
          showErrorSnackbar('Failed to create movie.');
        },
      });
      closeDialog();
      clearForm();
    } catch (error) {
      showErrorSnackbar('Failed to create movie.');
    }
  };

  const onCancel = () => {
    closeDialog();
    setShowPosters(false);
  };

  const onSelectPoster = (posterUrl) => {
    setFormData({ ...formData, image_url: posterUrl });
    setShowPosters(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialMovieState);
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Add new movie</DialogTitle>
      <form onSubmit={submitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          <MovieForm
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            setShowPosters={setShowPosters}
          />

          <PosterDialog
            visible={showPosters}
            closeDialog={() => setShowPosters((prev) => !prev)}
            query={formData?.title}
            onSelect={onSelectPoster}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              closeDialog();
              clearForm();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={addMovie.isLoading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
