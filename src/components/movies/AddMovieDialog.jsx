import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import initialMovieFormState from '../../models/initialMovieFormState';
import MovieController from '../../data/MovieController';
import MovieForm from './MovieForm';

export default function AddMovieDialog({ visible, closeDialog, submitAction }) {
  const [formData, setFormData] = useState(initialMovieFormState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialMovieFormState);
  };

  const submitForm = async () => {
    try {
      await MovieController.addMovie(formData);
      submitAction();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={visible}>
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
            submitForm();
            closeDialog();
            clearForm();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
