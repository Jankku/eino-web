import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import initialBookState from '../../models/initialBookState';
import { getBookDetails, updateBook } from '../../data/Book';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function EditBookDialog({ visible, closeDialog, bookId }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const { isLoading, refetch } = useQuery(['book', bookId], () => getBookDetails(bookId), {
    onSuccess: (data) => setFormData(data),
    onError: () => showErrorSnackbar('Failed to fetch book.'),
    enabled: visible,
  });
  const mutation = useMutation((editedBook) => updateBook(bookId, editedBook), {
    onSuccess: () => {
      showSuccessSnackbar('Book saved.');
      refetch();
      queryClient.invalidateQueries(['books']);
    },
    onError: () => {
      showErrorSnackbar('Failed to save book.');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialBookState);
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Edit book</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : formData ? (
          <BookForm
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
        ) : null}
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
          disabled={isLoading}
          color="primary"
          onClick={() => {
            mutation.mutate(formData);
            closeDialog();
          }}
        >
          Submit changes
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
