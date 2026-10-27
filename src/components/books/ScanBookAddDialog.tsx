import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { useEffect, useRef, useState } from 'react';
import { Button, DialogContent, Typography } from '@mui/material';
import BookForm from './BookForm';
import BaseDialog from '../common/BaseDialog';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { bookSchema, getBookDefaults, getNewBookValues, Book } from '../../models/book';
import { useAddBook } from '../../data/books/useAddBook';
import CoverDialog from './CoverDialog';
import { formatBookSearchQuery } from '../../utils/imageQueryUtil';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const getInitialBookFormValues = (initialValues?: Partial<Book>) =>
  bookSchema.parse({
    ...getBookDefaults(),
    ...initialValues,
  });

export const mergePrefillWithTouchedFields = (
  currentValues: Book,
  incomingValues: Book,
  touchedFields: Partial<Record<keyof Book, boolean>>,
) => {
  const mergedValues = Object.fromEntries(
    (Object.entries(incomingValues) as [keyof Book, Book[keyof Book]][]).map(
      ([fieldName, value]) => [
        fieldName,
        touchedFields[fieldName] ? currentValues[fieldName] : value,
      ],
    ),
  );

  return bookSchema.parse(mergedValues);
};

type BookFormInput = z.input<typeof bookSchema>;

type ScanBookAddDialogProps = {
  visible: boolean;
  initialValues?: Partial<Book>;
  prefillLoading?: boolean;
  closeDialog: () => void;
  onSuccess?: () => void;
};

export default function ScanBookAddDialog({
  visible,
  closeDialog,
  initialValues,
  onSuccess,
  prefillLoading = false,
}: ScanBookAddDialogProps) {
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [showCovers, setShowCovers] = useState(false);
  const previousInitialValuesRef = useRef<string | undefined>(undefined);
  const formMethods = useForm<BookFormInput, unknown, Book>({
    defaultValues: getBookDefaults(),
    resolver: zodResolver(bookSchema),
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    reset: resetForm,
    formState: { dirtyFields },
  } = formMethods;
  const [title, author] = useWatch({ control: formMethods.control, name: ['title', 'author'] });
  const addBookMutation = useAddBook();

  useEffect(() => {
    if (!visible) {
      previousInitialValuesRef.current = undefined;
      return;
    }

    const nextInitialValues = getInitialBookFormValues(initialValues);
    const nextInitialValuesKey = JSON.stringify(nextInitialValues);

    if (previousInitialValuesRef.current === nextInitialValuesKey) {
      return;
    }

    if (!previousInitialValuesRef.current) {
      resetForm(nextInitialValues);
      previousInitialValuesRef.current = nextInitialValuesKey;
      return;
    }

    const mergedValues = mergePrefillWithTouchedFields(
      bookSchema.parse(getValues()),
      nextInitialValues,
      dirtyFields as Partial<Record<keyof Book, boolean>>,
    );

    resetForm(mergedValues, { keepDirty: true, keepTouched: true });
    previousInitialValuesRef.current = nextInitialValuesKey;
  }, [dirtyFields, getValues, initialValues, resetForm, visible]);

  const onSubmit = (formData: Book) => {
    addBookMutation.mutate(getNewBookValues(formData, dirtyFields), {
      onSuccess: () => {
        showSuccessSnackbar('Book created');
        onSuccess?.();
        closeDialog();
        resetForm(getBookDefaults());
        setShowCovers(false);
      },
      onError: () => {
        showErrorSnackbar('Failed to create book');
      },
    });
  };

  const onCancel = () => {
    closeDialog();
    resetForm(getBookDefaults());
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
            {prefillLoading ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Fetching book details from ISBN...
              </Typography>
            ) : null}
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
            <DialogPrimaryButton
              type="submit"
              disabled={addBookMutation.isPending || prefillLoading}
            >
              Create
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
