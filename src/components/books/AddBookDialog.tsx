import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { useState } from 'react';
import { Button, DialogContent } from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { bookSchema, getBookDefaults, getNewBookValues, Book } from '../../models/book';
import { useAddBook } from '../../data/books/useAddBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
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
  const {
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { dirtyFields },
  } = formMethods;
  const [title, author] = useWatch({ control: formMethods.control, name: ['title', 'author'] });
  const addBookMutation = useAddBook();

  const onSubmit = (formData: Book) => {
    addBookMutation.mutate(getNewBookValues(formData, dirtyFields), {
      onSuccess: () => {
        showSuccessSnackbar('Book created');
        closeDialog();
        resetForm();
      },
      onError: () => {
        showErrorSnackbar('Failed to create book');
        closeDialog();
        resetForm();
      },
    });
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
              query={formatBookSearchQuery(title ?? '', author ?? '')}
              onSelect={onSelectCover}
            />
          </DialogContent>
          <DialogFooter>
            <Button color="inherit" onClick={onCancel}>
              Cancel
            </Button>
            <DialogPrimaryButton type="submit" disabled={addBookMutation.isPending}>
              Create
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
