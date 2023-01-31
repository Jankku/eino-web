import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import initialBookState from '../../models/initialBookState';
import { addBook } from '../../data/Book';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Book from '../../models/Book';

export default function AddBookDialog({ visible, closeDialog }) {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [formData, setFormData] = useState(initialBookState);
  const addBookMutation = useMutation({
    mutationFn: (newBook) => addBook(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
  });

  const submitForm = (e) => {
    e.preventDefault();
    try {
      const book = Book.parse(formData);
      addBookMutation.mutate(book, {
        onSuccess: () => {
          showSuccessSnackbar('Book created.');
        },
        onError: () => {
          showErrorSnackbar('Failed to create book.');
        },
      });
      closeDialog();
      clearForm();
    } catch (error) {
      showErrorSnackbar('Failed to create book.');
    }
  };

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
      <DialogTitle>Add new book</DialogTitle>
      <form onSubmit={submitForm}>
        <DialogContent sx={{ paddingTop: 0 }}>
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
          <Button type="submit" color="primary" disabled={addBookMutation.isLoading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
