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
      showSuccessSnackbar('Movie created.');
      queryClient.invalidateQueries(['movies']);
    },
    onError: () => {
      showErrorSnackbar('Failed to create movie.');
    },
  });

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
      <DialogContent>
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
        <Button
          color="primary"
          onClick={() => {
            mutation.mutate(formData);
            closeDialog();
            clearForm();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
