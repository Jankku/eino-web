import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { getMovieDetails, updateMovie } from '../../data/Movie';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Movie from '../../models/Movie';

export default function EditMovieDialog({ visible, closeDialog, movieId }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadMovie = useQuery({
    queryKey: ['movieEdit', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: visible,
    refetchOnWindowFocus: false,
    staleTime: 0,
    onSuccess: (data) => setFormData(data),
  });
  const updateMovieMutation = useMutation({
    mutationFn: (editedMovie) => updateMovie(movieId, editedMovie),
    onSuccess: (updatedMovie) => queryClient.setQueryData(['movie', movieId], updatedMovie),
  });

  const onSubmitForm = (e) => {
    e.preventDefault();
    try {
      const movie = Movie.parse(formData);
      updateMovieMutation.mutate(movie, {
        onSuccess: () => {
          closeDialog();
          showSuccessSnackbar('Movie saved.');
          queryClient.invalidateQueries(['movies']);
        },
        onError: () => showErrorSnackbar('Failed to save movie.'),
      });
    } catch (error) {
      showErrorSnackbar('Failed to save movie.');
    }
  };

  const onCancel = () => closeDialog();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Edit movie</DialogTitle>
      <form onSubmit={onSubmitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {formData ? (
            <MovieForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />
          ) : loadMovie.isError ? (
            <Grid container justifyContent="center">
              <Typography paragraph>Failed to load movie</Typography>
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loadMovie.isLoading || loadMovie.isError | updateMovieMutation.isLoading}
            color="primary"
          >
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
