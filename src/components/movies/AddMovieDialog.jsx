import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import initialMovieState from '../../models/initialMovieState';
import { addMovie } from '../../data/Movie';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Movie from '../../models/Movie';

export default function AddMovieDialog({ visible, closeDialog }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState(initialMovieState);
  const addMovieMutation = useMutation({
    mutationFn: (newMovie) => addMovie(newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    try {
      const movie = Movie.parse(formData);
      addMovieMutation.mutate(movie, {
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
    <BaseDialog open={visible}>
      <DialogTitle>Add new movie</DialogTitle>
      <form onSubmit={submitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          <MovieForm
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
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
          <Button type="submit" color="primary" disabled={addMovieMutation.isLoading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
