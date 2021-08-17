import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Header from '../common/Header';
import axios from '../../axios';
import {
  CircularProgress,
  Container,
  Fab,
  Grid,
  Select,
} from '@material-ui/core';
import AddBookDialog from './AddBookDialog';
import BookList from './BookList';
import bookSortOptions from '../../models/bookSortOptions';
import useToken from '../../utils/useToken';

const PREFIX = 'Books';

const classes = {
  title: `${PREFIX}-title`,
  fab: `${PREFIX}-fab`,
  noBooks: `${PREFIX}-noBooks`,
};

const Root = styled('div')({
  [`& .${classes.title}`]: {
    marginBottom: '1em',
  },
  [`& .${classes.fab}`]: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
  },
  [`& .${classes.noBooks}`]: {
    fontWeight: 700,
  },
});

export default function Books() {
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

  const handleAddDialogOpen = () => {
    setAddDialogVisible(true);
  };

  const handleAddDialogCancel = () => {
    setAddDialogVisible(false);
  };

  return (
    <Root>
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
              {bookSortOptions.map((item, itemIdx) => {
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
          closeDialog={handleAddDialogCancel}
          fetchBooks={fetchBooks}
        />
        <Fab
          color="primary"
          aria-label="create"
          className={classes.fab}
          onClick={handleAddDialogOpen}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Root>
  );
}
