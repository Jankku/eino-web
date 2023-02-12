import { useEffect, useState } from 'react';
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
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Book from '../../models/Book';
import { useUpdateBook, useUpdateBookFormData } from '../../data/books/useUpdateBook';

export default function EditBookDialog({ visible, closeDialog, bookId }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadBook = useUpdateBookFormData(visible, bookId);
  const updateBook = useUpdateBook(bookId);

  useEffect(() => {
    setFormData(loadBook.data);
  }, [loadBook.data, setFormData]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    try {
      const book = Book.parse(formData);
      updateBook.mutate(book, {
        onSuccess: () => {
          closeDialog();
          showSuccessSnackbar('Book saved.');
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
    <BaseDialog open={visible} onClose={() => closeDialog()}>
      <DialogTitle>Edit book</DialogTitle>
      <form onSubmit={onSubmitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {updateBook.isLoading ? <LinearProgress /> : null}

          {formData ? (
            <BookForm
              formData={formData}
              handleChange={handleChange}
              handleDateChange={handleDateChange}
            />
          ) : null}

          {loadBook.isLoading ? (
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : null}

          {loadBook.isLoadingError ? (
            <Typography paragraph>Failed to load form data.</Typography>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loadBook.isLoading || loadBook.isLoadingError || updateBook.isLoading}
            color="primary"
          >
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
