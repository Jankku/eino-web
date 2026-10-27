import ErrorMessage from '../authentication/ErrorMessage';
import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { useState } from 'react';
import { Button, CircularProgress, DialogContent, Typography, Stack } from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { bookSchema, Book, getBookDefaults } from '../../models/book';
import { useUpdateBook, useUpdateBookFormData } from '../../data/books/useUpdateBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type EditBookDialogProps = {
  visible: boolean;
  closeDialog: () => void;
  bookId: string;
};

export default function EditBookDialog({ visible, closeDialog, bookId }: EditBookDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const loadBook = useUpdateBookFormData(visible, bookId);
  const formMethods = useForm({
    defaultValues: getBookDefaults(),
    values: bookSchema.parse(loadBook.data),
    resolver: zodResolver(bookSchema),
  });
  const { handleSubmit, setValue, reset: resetForm } = formMethods;
  const [title, author] = useWatch({ control: formMethods.control, name: ['title', 'author'] });
  const updateBook = useUpdateBook(bookId);

  const onSubmit = (formData: Book) => {
    updateBook.reset();
    updateBook.mutate(formData, {
      onSuccess: () => {
        showSuccessSnackbar('Book updated');
        closeDialog();
      },
    });
  };

  const onSelectCover = (coverUrl: string) => {
    setValue('image_url', coverUrl);
    setShowCovers(false);
  };

  const onCancel = () => {
    updateBook.reset();
    closeDialog();
    resetForm();
    setShowCovers(false);
  };

  return (
    <BaseDialog title="Edit book" open={visible} onClose={onCancel}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ paddingTop: 0 }}>
            {updateBook.isError ? (
              <ErrorMessage message="Failed to save book. Check your connection and try submitting again." />
            ) : null}
            <BookForm onShowCovers={() => setShowCovers(true)} />

            {loadBook.isLoading ? (
              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}
              >
                <CircularProgress />
              </Stack>
            ) : null}

            {loadBook.isLoadingError ? (
              <Typography component="p">Failed to load form data.</Typography>
            ) : null}

            <CoverDialog
              visible={showCovers}
              closeDialog={() => setShowCovers((prev) => !prev)}
              query={formatBookSearchQuery(title ?? '', author ?? '')}
              onSelect={onSelectCover}
            />
          </DialogContent>

          <DialogFooter>
            <Button color="inherit" onClick={onCancel}>
              Cancel
            </Button>
            <DialogPrimaryButton
              loading={updateBook.isPending}
              type="submit"
              disabled={loadBook.isLoading || loadBook.isLoadingError || updateBook.isPending}
            >
              Submit changes
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
