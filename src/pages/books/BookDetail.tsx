import { Button, capitalize } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useReducer } from 'react';
import { useBookDetail } from '../../data/books/useBookDetail';
import { useDeleteBook } from '../../data/books/useDeleteBook';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteButton from '../../components/common/DeleteButton';
import BaseDetailLayout from '../../components/layout/BaseDetailLayout';

export default function BookDetail() {
  const navigate = useNavigate();
  const bookId = useParams().bookId!;
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { data } = useBookDetail(bookId);
  const deleteBook = useDeleteBook();

  const copyToClipboard = async () => {
    try {
      const contents = data.author ? `${data.author} - ${data.title}` : data.title;
      await navigator.clipboard.writeText(contents);
      showSuccessSnackbar('Copied');
    } catch {
      showErrorSnackbar('Failed to copy');
    }
  };

  return (
    <BaseDetailLayout
      imageUrl={data.image_url}
      details={
        <>
          <DetailItem title="Title" text={data.title} />
          <DetailItem title="Author" text={data.author} />
          <DetailItem title="Publisher" text={data.publisher} />
          <DetailItem title="ISBN" text={data.isbn} />
          <DetailItem title="Pages" text={data.pages} />
          <DetailItem title="Release year" text={data.year} />
          <DetailItem title="Status" text={capitalize(String(data.status))} />
          <DetailItem title="Score" text={data.score} />
          <DetailItem
            title="Start date"
            text={DateTime.fromISO(data.start_date).toLocaleString()}
          />
          <DetailItem title="End date" text={DateTime.fromISO(data.end_date).toLocaleString()} />
        </>
      }
      actions={
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditDialog}
            startIcon={<CreateIcon />}
            sx={{ margin: '0.5em' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={copyToClipboard}
            startIcon={<ContentCopyIcon />}
            sx={{ margin: '0.5em' }}
          >
            Copy
          </Button>
          <DeleteButton
            loading={deleteBook.isPending}
            variant="contained"
            color="secondary"
            sx={{ margin: '0.5em' }}
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
    </BaseDetailLayout>
  );
}
