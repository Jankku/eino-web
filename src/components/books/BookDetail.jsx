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
import React, { useState, useCallback, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';
import axios from '../../axios';
import useToken from '../../utils/useToken';
import Header from '../common/Header';
import EditBookDialog from './EditBookDialog';
import BookDetailItem from './BookDetailItem';

export default function BookDetail(props) {
  const history = useHistory();
  const { token } = useToken();
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [book, setBook] = useState({});

  const fetchBookDetails = useCallback(async () => {
    try {
      const res = await axios({
        method: 'get',
        url: `/api/list/books/book/${props.computedMatch.params.bookId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      setBook(res.data.results[0]);
    } catch (err) {
      console.error(err);
    }
  }, [props.computedMatch.params.bookId, token]);

  useEffect(() => {
    fetchBookDetails();
  }, [props.computedMatch.params.bookId, setBook, token, fetchBookDetails]);

  const saveBook = async () => {
    try {
      await axios({
        method: 'put',
        url: `/api/list/books/update/${props.computedMatch.params.bookId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
        data: book,
      });

      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async () => {
    try {
      await axios({
        method: 'delete',
        url: `/api/list/books/delete/${props.computedMatch.params.bookId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

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
