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
import { getBookDetails, updateBook } from '../../data/Book';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Book from '../../models/Book';

export default function EditBookDialog({ visible, closeDialog, bookId }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadBook = useQuery(['bookEdit', bookId], () => getBookDetails(bookId), {
    enabled: visible,
    refetchOnWindowFocus: false,
    staleTime: 0,
    onSuccess: (data) => setFormData(data),
  });
  const updateBookMutation = useMutation((editedBook) => updateBook(bookId, editedBook), {
    onSuccess: (updatedBook) => queryClient.setQueryData(['book', bookId], updatedBook),
  });

  const onSubmitForm = (e) => {
    e.preventDefault();
    try {
      const book = Book.parse(formData);
      updateBookMutation.mutate(book, {
        onSuccess: () => {
          closeDialog();
          showSuccessSnackbar('Book saved.');
          queryClient.invalidateQueries(['books']);
        },
        onError: () => showErrorSnackbar('Failed to save book.'),
      });
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Failed to save book.');
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
      <DialogTitle>Edit book</DialogTitle>
      <form onSubmit={onSubmitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {formData ? (
            <BookForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />
          ) : loadBook.isError ? (
            <Grid container justifyContent="center">
              <Typography paragraph>Failed to load book</Typography>
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

          <Button type="submit" disabled={loadBook.isFetching || loadBook.isError} color="primary">
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
