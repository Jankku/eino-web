import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import initialMovieFormState from '../../models/initialMovieFormState';
import MovieController from '../../data/MovieController';
import MovieForm from './MovieForm';

export default function EditMovieDialog({
  visible,
  closeDialog,
  movieId,
  submitAction,
}) {
  const [formData, setFormData] = useState(initialMovieFormState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        setLoading(true);

        const res = await MovieController.getMovieDetails(movieId);
        setFormData(res.data.results[0]);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (visible === true) getFormData();
  }, [movieId, visible]);

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
      await MovieController.updateMovie(movieId, formData);
      submitAction();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={visible}>
      <DialogTitle>Edit movie</DialogTitle>
      {!isLoading ? (
        <DialogContent>
          <MovieForm
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
        </DialogContent>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
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
        {
          // Disable button while loading
          !isLoading ? (
            <Button
              color="primary"
              onClick={() => {
                submitForm();
                closeDialog();
              }}
            >
              Submit changes
            </Button>
          ) : (
            <Button
              disabled
              color="primary"
              onClick={() => {
                submitForm();
                closeDialog();
              }}
            >
              Submit changes
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  );
}
