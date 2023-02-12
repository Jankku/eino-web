import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useReducer } from 'react';
import { useBookDetail } from '../../data/books/useBookDetail';
import { useDeleteBook } from '../../data/books/useDeleteBook';

export default function BookDetail() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { data } = useBookDetail(bookId);
  const deleteBook = useDeleteBook();

  return (
    <Container maxWidth="md">
      <Card
        sx={{
          mt: 3,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ pb: 0 }}>
          <Grid container columns={3} justifyContent="flex-start">
            <DetailItem title="Title" text={data.title} />
            <DetailItem title="Author" text={data.author} />
            <DetailItem title="Publisher" text={data.publisher} />
            <DetailItem title="ISBN" text={data.isbn} />
            <DetailItem title="Pages" text={data.pages} />
            <DetailItem title="Year" text={data.year} />
            <DetailItem title="Status" text={capitalize(String(data.status))} />
            <DetailItem title="Score" text={data.score} />
            <DetailItem
              title="Start date"
              text={DateTime.fromISO(data.start_date).toLocaleString()}
            />
            <DetailItem title="End date" text={DateTime.fromISO(data.end_date).toLocaleString()} />
          </Grid>
        </CardContent>
        <CardActions sx={{ m: 0, pt: 0, pl: 2, pb: 3 }}>
          <Grid container>
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
              color="secondary"
              onClick={() =>
                deleteBook.mutate(bookId, {
                  onSuccess: () => {
                    showSuccessSnackbar('Book deleted.');
                    navigate(-1);
                  },
                  onError: () => {
                    showErrorSnackbar('Failed to delete book.');
                  },
                })
              }
              startIcon={<DeleteIcon />}
              sx={{ margin: '0.5em' }}
            >
              Delete
            </Button>
            {deleteBook.isLoading ? <CircularProgress /> : null}
          </Grid>
        </CardActions>
      </Card>

      <EditBookDialog visible={editDialogOpen} closeDialog={toggleEditDialog} bookId={bookId} />
    </Container>
  );
}
