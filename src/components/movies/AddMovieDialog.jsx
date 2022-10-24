import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import initialMovieState from '../../models/initialMovieState';
import { addMovie } from '../../data/Movie';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQueryClient } from 'react-query';

export default function AddMovieDialog({ visible, closeDialog }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState(initialMovieState);
  const mutation = useMutation((newMovie) => addMovie(newMovie), {
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        showSuccessSnackbar('Movie created.');
      },
      onError: () => {
        showErrorSnackbar('Failed to create movie.');
      },
    });
    closeDialog();
    clearForm();
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
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
