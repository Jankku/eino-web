import {
  Button,
  capitalize,
  CircularProgress,
  Container,
  Grid,
  Paper,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import EditBookDialog from '../../components/books/EditBookDialog';
import BookDetailItem from '../../components/books/BookDetailItem';
import BookController from '../../data/BookController';
import { useCallback } from 'react';

export default function BookDetail() {
  const history = useHistory();
  const { bookId } = useParams();
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [book, setBook] = useState({});

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
      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async () => {
    try {
      BookController.deleteBook(bookId);
      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <>
      <Header />
      <Container maxWidth="md">
        {book.hasOwnProperty('book_id') ? (
          <Paper sx={{ mt: 1.5, p: 2.5 }}>
            <Grid container columns={3} justifyContent="flex-start">
              <BookDetailItem title="Title" text={book.title} />
              <BookDetailItem title="Author" text={book.author} />
              <BookDetailItem title="Publisher" text={book.publisher} />
              <BookDetailItem title="ISBN" text={book.isbn} />
              <BookDetailItem title="Pages" text={book.pages} />
              <BookDetailItem title="Year" text={book.year} />
              <BookDetailItem title="Status" text={capitalize(book.status)} />
              <BookDetailItem title="Score" text={book.score} />
              <BookDetailItem
                title="Start date"
                text={DateTime.fromISO(book.start_date).toLocaleString()}
              />
              <BookDetailItem
                title="End date"
                text={DateTime.fromISO(book.end_date).toLocaleString()}
              />
            </Grid>
            <Grid container justifyContent="flex-start">
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

            <EditBookDialog
              visible={editDialogVisible}
              closeDialog={handleEditDialogCancel}
              bookId={book.book_id}
              submitAction={fetchBookDetails}
            />
          </Paper>
        ) : (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
      </Container>
    </>
  );
}
