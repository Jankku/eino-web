import { useState } from 'react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { bookSchema, Book, getBookDefaults } from '../../models/book';
import { useUpdateBook, useUpdateBookFormData } from '../../data/books/useUpdateBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type EditBookDialogProps = {
  visible: boolean;
  closeDialog: () => void;
  bookId: string;
};

export default function EditBookDialog({ visible, closeDialog, bookId }: EditBookDialogProps) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const loadBook = useUpdateBookFormData(visible, bookId);
  const formMethods = useForm({
    defaultValues: getBookDefaults(),
    values: bookSchema.parse(loadBook.data),
    resolver: zodResolver(bookSchema),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const updateBook = useUpdateBook(bookId);

  const onSubmit = (formData: Book) => {
    updateBook.mutate(formData, {
      onSuccess: () => {
        showSuccessSnackbar('Book updated');
        closeDialog();
      },
      onError: () => {
        showErrorSnackbar('Failed to save book');
        closeDialog();
      },
    });
  };

  const onSelectCover = (coverUrl: string) => {
    setValue('image_url', coverUrl);
    setShowCovers(false);
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowCovers(false);
  };

  return (
    <BaseDialog title="Edit book" open={visible} onClose={onCancel}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            <BookForm onShowCovers={() => setShowCovers(true)} />

            {loadBook.isLoading ? (
              <Grid
                container
                sx={{
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Grid>
            ) : null}

            {loadBook.isLoadingError ? (
              <Typography component="p">Failed to load form data.</Typography>
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
            <Button
              loading={updateBook.isPending}
              type="submit"
              disabled={loadBook.isLoading || loadBook.isLoadingError || updateBook.isPending}
              color="primary"
            >
              Submit changes
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
