import { Box, Button, capitalize, Stack } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams, useSearchParams } from 'react-router';
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
import ScoreChip from '../../components/common/ScoreChip';
import StatusChip from '../../components/common/StatusChip';

const numberFormatter = new Intl.NumberFormat();

export default function BookDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const onDelete = () => {
    deleteBook.mutate(bookId, {
      onSuccess: () => {
        showSuccessSnackbar('Book deleted');
        navigate({ pathname: '/books', search: searchParams.toString() });
      },
      onError: () => {
        showErrorSnackbar('Failed to delete book');
      },
    });
  };

  return (
    <BaseDetailLayout
      imageUrl={data.image_url}
      copyText="Copy title and author"
      onCopy={copyToClipboard}
      details={
        <>
          <Stack direction="row" mb={0.5}>
            <ScoreChip score={data.score} />
            <StatusChip
              status={data.status}
              chipText={
                data.status === 'completed' && data.end_date
                  ? `${capitalize(data.status)} ${DateTime.fromISO(data.end_date).toRelative()}`
                  : capitalize(data.status)
              }
              tooltipText={`Reading time: ${DateTime.fromISO(data.end_date).diff(DateTime.fromISO(data.start_date), 'days').toHuman()} (${DateTime.fromISO(data.start_date).toLocaleString()}–${DateTime.fromISO(data.end_date).toLocaleString()})`}
            />
          </Stack>
          <Stack mb={2}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
              {data.title}
            </Box>
            <Box component="span">{[data.author, data.year].filter(Boolean).join(', ')}</Box>
          </Stack>
          <Box component="dl">
            {data.publisher ? <DetailItem title="Publisher" value={data.publisher} /> : undefined}
            {data.pages ? (
              <DetailItem title="Pages" value={numberFormatter.format(data.pages)} />
            ) : undefined}
            {data.language_code ? (
              <DetailItem title="Language" value={languageCodeToName(data.language_code)} />
            ) : undefined}
            {data.isbn ? <DetailItem title="ISBN" value={data.isbn} /> : undefined}
            {data.note ? <DetailItem multiline title="Note" value={data.note} /> : undefined}
          </Box>
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
            onClick={onDelete}
          />
        </>
      }
    >
      {editDialogOpen ? (
        <EditBookDialog visible={editDialogOpen} closeDialog={toggleEditDialog} bookId={bookId} />
      ) : undefined}

      {completeDialogOpen ? (
        <CompleteDialog
          visible={completeDialogOpen}
          closeDialog={toggleCompleteDialog}
          onComplete={onComplete}
        />
      ) : undefined}
    </BaseDetailLayout>
  );
}
