import { Button, capitalize } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useBookDetail } from '../../data/books/useBookDetail';
import { useDeleteBook } from '../../data/books/useDeleteBook';
import DeleteButton from '../../components/common/DeleteButton';
import BaseDetailLayout from '../../components/layout/BaseDetailLayout';
import { useToggle } from '@uidotdev/usehooks';
import DoneIcon from '@mui/icons-material/Done';
import CompleteDialog from '../../components/common/CompleteDialog';
import { useUpdateBook } from '../../data/books/useUpdateBook';
import { bookSchema } from '../../models/book';
import { languageCodeToName } from '../../utils/languages';

export default function BookDetail() {
  const navigate = useNavigate();
  const bookId = useParams().bookId!;
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useToggle(false);
  const [completeDialogOpen, toggleCompleteDialog] = useToggle(false);
  const { data } = useBookDetail(bookId);
  const updateBook = useUpdateBook(bookId);
  const deleteBook = useDeleteBook();

  const isCompleted = data.status === 'completed';

  const copyToClipboard = async () => {
    try {
      const contents = data.author ? `${data.author} - ${data.title}` : data.title;
      await navigator.clipboard.writeText(contents);
      showSuccessSnackbar('Title and author copied to clipboard');
    } catch {
      showErrorSnackbar('Failed to copy');
    }
  };

  const onComplete = (score: number) => {
    updateBook.mutate(
      bookSchema.parse({ ...data, score, status: 'completed', end_date: DateTime.now().toISO() }),
      {
        onSuccess: () => {
          showSuccessSnackbar('Book marked as completed');
        },
        onError: () => {
          showErrorSnackbar('Failed to mark book as completed');
        },
      },
    );
  };

  return (
    <BaseDetailLayout
      backButtonDefaultUrl="/books"
      imageUrl={data.image_url}
      copyText="Copy title and author"
      onCopy={copyToClipboard}
      details={
        <>
          <DetailItem title="Title" text={data.title} />
          <DetailItem title="Author" text={data.author} />
          <DetailItem title="Publisher" text={data.publisher} />
          <DetailItem title="Language" text={languageCodeToName(data.language_code)} />
          <DetailItem title="ISBN" text={data.isbn} />
          <DetailItem title="Pages" text={data.pages} />
          <DetailItem title="Released" text={data.year} />
          <DetailItem title="Status" text={capitalize(String(data.status))} />
          <DetailItem title="Score" text={data.score} />
          <DetailItem
            title="Start date"
            text={DateTime.fromISO(data.start_date).toLocaleString()}
          />
          <DetailItem title="End date" text={DateTime.fromISO(data.end_date).toLocaleString()} />
          <DetailItem multiline title="Note" text={data.note} />
        </>
      }
      actions={
        <>
          {!isCompleted ? (
            <Button
              variant="contained"
              color="success"
              onClick={toggleCompleteDialog as () => void}
              startIcon={<DoneIcon />}
            >
              Complete
            </Button>
          ) : undefined}
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditDialog as () => void}
            startIcon={<CreateIcon />}
          >
            Edit
          </Button>
          <DeleteButton
            loading={deleteBook.isPending}
            variant="outlined"
            color="secondary"
            onClick={() => {
              deleteBook.mutate(bookId, {
                onSuccess: () => {
                  showSuccessSnackbar('Book deleted');
                  navigate(-1);
                },
                onError: () => {
                  showErrorSnackbar('Failed to delete book');
                },
              });
            }}
          />
        </>
      }
    >
      <EditBookDialog visible={editDialogOpen} closeDialog={toggleEditDialog} bookId={bookId} />

      <CompleteDialog
        visible={completeDialogOpen}
        closeDialog={toggleCompleteDialog}
        onComplete={onComplete}
      />
    </BaseDetailLayout>
  );
}
