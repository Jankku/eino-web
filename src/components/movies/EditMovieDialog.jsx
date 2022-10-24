import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { getMovieDetails, updateMovie } from '../../data/Movie';
import MovieForm from './MovieForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { formatItemDates } from '../../utils/itemDateUtil';

export default function EditMovieDialog({ visible, closeDialog, movieId }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadMovie = useQuery(['movie', movieId], () => getMovieDetails(movieId), {
    enabled: visible,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const movie = formatItemDates(data);
      setFormData(movie);
    },
  });
  const updateMovieMutation = useMutation(
    (editedMovie) => {
      const movie = formatItemDates(editedMovie);
      return updateMovie(movieId, movie);
    },
    {
      onSuccess: (updatedMovie) => queryClient.setQueryData(['movie', movieId], updatedMovie),
    }
  );

  const submitForm = (e) => {
    e.preventDefault();
    updateMovieMutation.mutate(formData, {
      onSuccess: () => {
        closeDialog();
        showSuccessSnackbar('Movie saved.');
        queryClient.invalidateQueries(['movies']);
      },
      onError: () => showErrorSnackbar('Failed to save movie.'),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Edit movie</DialogTitle>
      <form onSubmit={submitForm}>
        {loadMovie.isFetching && !loadMovie.isLoading ? <LinearProgress /> : null}

        <DialogContent sx={{ paddingTop: 0 }}>
          {loadMovie.isError ? (
            <Grid container justifyContent="center">
              <Typography paragraph>Failed to load movie</Typography>
            </Grid>
          ) : loadMovie.isLoading ? (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : formData ? (
            <MovieForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>

          <Button type="submit" disabled={loadMovie.isLoading || loadMovie.isError} color="primary">
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
