import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import { getBookDetails, deleteBook } from '../../data/Book';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useReducer } from 'react';

export default function BookDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { bookId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { isLoading, isError, data } = useQuery(['book', bookId], () => getBookDetails(bookId), {
    visible: bookId,
    onError: () => showErrorSnackbar('Failed to load book'),
    initialData: () =>
      queryClient
        .getQueryData(['books', 'all'], { exact: true })
        ?.find((b) => b.book_id === bookId),
  });
  const deleteBookMutation = useMutation((bookId) => deleteBook(bookId), {
    onSuccess: () => queryClient.invalidateQueries(['books']),
  });

  return (
    <Container maxWidth="md">
      {isError ? (
        <Grid container justifyContent="center" pt={8}>
          <Typography variant={'h6'}>Couldn&apos;t find book</Typography>
        </Grid>
      ) : isLoading ? (
        <Grid container justifyContent="center" pt={8}>
          <CircularProgress />
        </Grid>
      ) : data ? (
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
              <DetailItem
                title="End date"
                text={DateTime.fromISO(data.end_date).toLocaleString()}
              />
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
                  deleteBookMutation.mutate(bookId, {
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
            </Grid>
          </CardActions>
        </Card>
      ) : null}

      <EditBookDialog visible={editDialogOpen} closeDialog={toggleEditDialog} bookId={bookId} />
    </Container>
  );
}
