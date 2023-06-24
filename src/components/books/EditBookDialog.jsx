import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import Book, { bookDefaults } from '../../models/Book';
import { useUpdateBook, useUpdateBookFormData } from '../../data/books/useUpdateBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function EditBookDialog({ visible, closeDialog, bookId }) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const formMethods = useForm({
    defaultValues: bookDefaults,
    resolver: zodResolver(Book),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const loadBook = useUpdateBookFormData(visible, bookId);
  const updateBook = useUpdateBook(bookId);

  useEffect(() => {
    resetForm(Book.parse(loadBook.data));
  }, [loadBook.data, resetForm]);

  const onSubmit = (formData) => {
    try {
      updateBook.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Book saved.');
        },
        onError: () => {
          showErrorSnackbar('Failed to save book.');
        },
      });
      closeDialog();
    } catch (error) {
      console.error(error);
      showErrorSnackbar('Failed to save book.');
    }
  };

  const onSelectCover = (coverUrl) => {
    setValue('image_url', coverUrl);
    setShowCovers(false);
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowCovers(false);
  };

  return (
    <BaseDialog open={visible} onClose={onCancel}>
      <DialogTitle>Edit book</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <BookForm onShowCovers={() => setShowCovers(true)} />

            {loadBook.isLoading ? (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : null}

            {loadBook.isLoadingError ? (
              <Typography paragraph>Failed to load form data.</Typography>
            ) : null}

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

            <LoadingButton
              loading={updateBook.isLoading}
              type="submit"
              disabled={loadBook.isLoading || loadBook.isLoadingError || updateBook.isLoading}
              color="primary"
            >
              Submit changes
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
