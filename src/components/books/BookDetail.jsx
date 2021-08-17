import {
  Button,
  capitalize,
  CircularProgress,
  Container,
  Grid,
  Paper,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';
import axios from '../../axios';
import useToken from '../../utils/useToken';
import Header from '../common/Header';
import EditBookDialog from './EditBookDialog';
import BookDetailItem from './BookDetailItem';
import { useCallback } from 'react';

const PREFIX = 'BookDetail';

const classes = {
  items: `${PREFIX}-items`,
  btn: `${PREFIX}-btn`,
  btnGroup: `${PREFIX}-btnGroup`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.items}`]: {
    marginTop: '1em',
    padding: '1em 0em 2em 0em',
  },

  [`& .${classes.btn}`]: {
    marginLeft: '1em',
  },

  [`& .${classes.btnGroup}`]: {
    marginTop: '1em',
  },
}));

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
    <Root>
      <Header />
      <Container maxWidth="md">
        {book.hasOwnProperty('book_id') ? (
          <Paper className={classes.items}>
            <Grid container justifyContent="center">
              <Grid>
                <BookDetailItem title="Title" text={book.title} />
                <BookDetailItem title="Author" text={book.author} />
                <BookDetailItem title="Publisher" text={book.publisher} />
                <BookDetailItem title="ISBN" text={book.isbn} />
              </Grid>
              <Grid>
                <BookDetailItem title="Pages" text={book.pages} />
                <BookDetailItem title="Year" text={book.year} />
                <BookDetailItem title="Status" text={capitalize(book.status)} />
              </Grid>
              <Grid>
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
            </Grid>
            <Grid
              container
              justifyContent="center"
              className={classes.btnGroup}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditDialogOpen}
                startIcon={<CreateIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={saveBook}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.btn}
                onClick={deleteBook}
                startIcon={<DeleteIcon />}
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
    </Root>
  );
}
