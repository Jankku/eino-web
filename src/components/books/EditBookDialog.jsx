import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import initialBookFormState from '../../models/initialBookFormState';
import BookController from '../../data/BookController';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../utils/useCustomSnackbar';

export default function EditBookDialog({ visible, closeDialog, bookId, submitAction }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState(initialBookFormState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        setLoading(true);
        const res = await BookController.getBookDetails(bookId);
        setFormData(res.data.results[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        showErrorSnackbar('Failed to fetch book.');
      }
    };

    if (visible === true) getFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, visible]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialBookFormState);
  };

  const submitForm = async () => {
    try {
      await BookController.updateBook(bookId, formData);
      showSuccessSnackbar('Book saved.');
      submitAction();
    } catch (err) {
      console.error(err);
      showErrorSnackbar('Failed to save book.');
    }
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Edit book</DialogTitle>
      {!isLoading ? (
        <DialogContent>
          <BookForm
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
          isLoading ? (
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
          ) : (
            <Button
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
    </BaseDialog>
  );
}
