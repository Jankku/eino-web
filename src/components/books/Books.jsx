import React, { useState, useEffect, Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Header from '../Header';
import axios from '../../axios';
import {
  CircularProgress,
  Container,
  Fab,
  Grid,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddBookDialog from './AddBookDialog';
import BookList from './BookList';
import bookStatus from '../../models/bookStatus';
import useToken from '../../utils/useToken';

const useStyles = makeStyles({
  title: {
    marginBottom: '1em',
  },
  fab: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
  },
  noBooks: {
    fontWeight: 700,
  },
});

export default function Books() {
  const classes = useStyles();
  const { token } = useToken();

  const [books, setBooks] = useState([]);
  const [bookSortStatus, setBookSortStatus] = useState('all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [isFetchingBooks, setisFetchingBooks] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBooks = async () => {
    setisFetchingBooks(true);

    try {
      const res = await axios({
        method: 'get',
        url: `/api/list/books/${bookSortStatus}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      setBooks(res.data.results);

      setisFetchingBooks(false);
    } catch (err) {
      console.error(err);
      setisFetchingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSortStatus]);

  const bookSortStatusChangeHandler = (e) => {
    setBookSortStatus(e.target.value);
  };

  const handleDialogOpen = () => {
    setAddDialogVisible(true);
  };

  const handleDialogCancel = () => {
    setAddDialogVisible(false);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className={classes.title}
        >
          <Grid item>
            <h1>Books</h1>
          </Grid>
          <Grid item>
            <Select
              native
              value={bookSortStatus}
              inputProps={{ name: 'bookSortStatus', id: 'bookSortStatus' }}
              onChange={bookSortStatusChangeHandler}
            >
              {bookStatus.map((item, itemIdx) => {
                return (
                  <option key={itemIdx} value={item.value}>
                    {item.name}
                  </option>
                );
              })}
            </Select>
          </Grid>
        </Grid>
        {isFetchingBooks ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : books.length > 0 ? (
          <BookList books={books} fetchBooks={fetchBooks} />
        ) : (
          <Grid container justifyContent="center">
            <p className={classes.noBooks}>No books</p>
          </Grid>
        )}
        <AddBookDialog
          visible={addDialogVisible}
          closeDialog={handleDialogCancel}
        />
        <Fab
          color="primary"
          aria-label="create"
          className={classes.fab}
          onClick={handleDialogOpen}
        >
          <AddIcon />
        </Fab>
      </Container>
    </>
  );
}
