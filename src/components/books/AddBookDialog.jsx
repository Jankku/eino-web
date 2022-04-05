import React, { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import initialBookFormState from '../../models/initialBookFormState';
import BookController from '../../data/BookController';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../utils/useCustomSnackbar';

export default function AddBookDialog({ visible, closeDialog, submitAction }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState(initialBookFormState);

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
      await BookController.addBook(formData);
      showSuccessSnackbar('Book created.');
      submitAction();
    } catch (err) {
      console.error(err);
      showErrorSnackbar('Failed to create book.');
    }
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Add new book</DialogTitle>
      <DialogContent>
        <BookForm
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
    </BaseDialog>
  );
}
