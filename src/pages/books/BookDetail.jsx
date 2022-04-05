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
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import BookController from '../../data/BookController';
import useCustomSnackbar from '../../utils/useCustomSnackbar';

export default function BookDetail() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [book, setBook] = useState({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    try {
      const res = await BookController.getBookDetails(bookId);
      setBook(res.data.results[0]);
    } catch (err) {
      console.error(err);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId, fetchBookDetails]);

  const saveBook = async () => {
    try {
      await BookController.updateBook(bookId, book);
      showSuccessSnackbar('Book saved.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      showErrorSnackbar('Failed to save book.');
    }
  };

  const deleteBook = async () => {
    try {
      await BookController.deleteBook(bookId);
      showSuccessSnackbar('Book deleted.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      showErrorSnackbar('Failed to delete book.');
    }
  };

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Container maxWidth="md">
      {book.hasOwnProperty('book_id') ? (
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
              <DetailItem title="Title" text={book.title} />
              <DetailItem title="Author" text={book.author} />
              <DetailItem title="Publisher" text={book.publisher} />
              <DetailItem title="ISBN" text={book.isbn} />
              <DetailItem title="Pages" text={book.pages} />
              <DetailItem title="Year" text={book.year} />
              <DetailItem title="Status" text={capitalize(book.status)} />
              <DetailItem title="Score" text={book.score} />
              <DetailItem
                title="Start date"
                text={DateTime.fromISO(book.start_date).toLocaleString()}
              />
              <DetailItem
                title="End date"
                text={DateTime.fromISO(book.end_date).toLocaleString()}
              />
            </Grid>
          </CardContent>
          <CardActions sx={{ m: 0, pt: 0, pl: 2, pb: 3 }}>
            <Grid container>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditDialogOpen}
                startIcon={<CreateIcon />}
                sx={{ margin: '0.5em' }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={saveBook}
                startIcon={<SaveIcon />}
                sx={{ margin: '0.5em' }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteBook}
                startIcon={<DeleteIcon />}
                sx={{ margin: '0.5em' }}
              >
                Delete
              </Button>
            </Grid>
          </CardActions>
        </Card>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}

      <EditBookDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        bookId={book.book_id}
        submitAction={fetchBookDetails}
      />
    </Container>
  );
}
