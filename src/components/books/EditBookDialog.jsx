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
import { getBookDetails, updateBook } from '../../data/Book';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { formatItemDates } from '../../utils/itemDateUtil';

export default function EditBookDialog({ visible, closeDialog, bookId }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState();
  const loadBook = useQuery(['book', bookId], () => getBookDetails(bookId), {
    enabled: visible,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      const book = formatItemDates(data);
      setFormData(book);
    },
  });
  const updateBookMutation = useMutation(
    (editedBook) => {
      const book = formatItemDates(editedBook);
      return updateBook(bookId, book);
    },
    {
      onSuccess: (updatedBook) => queryClient.setQueryData(['book', bookId], updatedBook),
    }
  );

  const submitForm = (e) => {
    e.preventDefault();
    updateBookMutation.mutate(formData, {
      onSuccess: () => {
        closeDialog();
        showSuccessSnackbar('Book saved.');
        queryClient.invalidateQueries(['books']);
      },
      onError: () => showErrorSnackbar('Failed to save book.'),
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
      <DialogTitle>Edit book</DialogTitle>
      <form onSubmit={submitForm}>
        {loadBook.isFetching && !loadBook.isLoading ? <LinearProgress /> : null}

        <DialogContent sx={{ paddingTop: 0 }}>
          {loadBook.isError ? (
            <Grid container justifyContent="center">
              <Typography paragraph>Failed to load book</Typography>
            </Grid>
          ) : loadBook.isLoading ? (
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
          <Button color="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>

          <Button type="submit" disabled={loadBook.isLoading || loadBook.isError} color="primary">
            Submit changes
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
