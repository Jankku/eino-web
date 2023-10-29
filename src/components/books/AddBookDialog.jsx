import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Book, { bookDefaults } from '../../models/Book';
import { useAddBook } from '../../data/books/useAddBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AddBookDialog({ visible, closeDialog }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const formMethods = useForm({
    defaultValues: bookDefaults,
    resolver: zodResolver(Book),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const addBookMutation = useAddBook();

  const onSubmit = (formData) => {
    try {
      addBookMutation.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Book created.');
        },
        onError: () => {
          showErrorSnackbar('Failed to create book.');
        },
      });
      closeDialog();
      resetForm();
    } catch (error) {
      showErrorSnackbar('Failed to create book.');
    }
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowCovers(false);
  };

  const onSelectCover = (coverUrl) => {
    setValue('image_url', coverUrl);
    setShowCovers(false);
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Add new book</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <BookForm onShowCovers={() => setShowCovers(true)} />

            <CoverDialog
              visible={showCovers}
              closeDialog={() => setShowCovers((prev) => !prev)}
              query={formatBookSearchQuery(getValues('title'), getValues('author'))}
              onSelect={onSelectCover}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={addBookMutation.isPending}>
              Create
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
