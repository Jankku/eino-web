import { useState } from 'react';
import { Button, DialogActions, DialogContent } from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { bookSchema, getBookDefaults, Book } from '../../models/book';
import { useAddBook } from '../../data/books/useAddBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type AddBookDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function AddBookDialog({ visible, closeDialog }: AddBookDialogProps) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const formMethods = useForm({
    defaultValues: getBookDefaults(),
    resolver: zodResolver(bookSchema),
  });
  const { handleSubmit, setValue, getValues, reset: resetForm } = formMethods;
  const addBookMutation = useAddBook();

  const onSubmit = (formData: Book) => {
    try {
      addBookMutation.mutate(formData, {
        onSuccess: () => {
          showSuccessSnackbar('Book created');
        },
        onError: () => {
          showErrorSnackbar('Failed to create book');
        },
      });
      closeDialog();
      resetForm();
    } catch {
      showErrorSnackbar('Failed to create book');
    }
  };

  const onCancel = () => {
    closeDialog();
    resetForm();
    setShowCovers(false);
  };

  const onSelectCover = (coverUrl: string) => {
    setValue('image_url', coverUrl);
    setShowCovers(false);
  };

  return (
    <BaseDialog title="Create book" open={visible} onClose={onCancel}>
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
