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
      updateBook(bookId, book);
    },
    {
      onSuccess: () => {
        showSuccessSnackbar('Book saved.');
        queryClient.invalidateQueries(['book', bookId]);
        queryClient.invalidateQueries(['books']);
      },
      onError: () => {
        showErrorSnackbar('Failed to save book.');
      },
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Edit book</DialogTitle>
      <DialogContent>
        {loadBook.isError ? (
          <Grid container justifyContent="center">
            <Typography paragraph>Failed to load book</Typography>
          </Grid>
        ) : loadBook.isFetching ? (
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

        <Button
          disabled={loadBook.isFetching || loadBook.isError}
          color="primary"
          onClick={() => {
            updateBookMutation.mutate(formData);
            closeDialog();
          }}
        >
          Submit changes
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
