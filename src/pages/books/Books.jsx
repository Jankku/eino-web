import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Fab, Grid, Select, Typography } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import BookController from '../../data/BookController';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [bookSortStatus, setBookSortStatus] = useState('all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBooks = async () => {
    try {
      setIsFetching(true);

      const res = await BookController.getBooksByStatus(bookSortStatus);
      setBooks(res.data.results);

      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
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
    <>
      <Grid container alignItems="center" justifyContent="space-between">
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
      {isFetching ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : books.length > 0 ? (
        <BookList books={books} fetchBooks={fetchBooks} />
      ) : (
        <Grid container justifyContent="center">
          <Typography paragraph sx={{ fontWeight: 700 }}>
            No books
          </Typography>
        </Grid>
      )}
      <AddBookDialog
        visible={addDialogVisible}
        closeDialog={handleAddDialogCancel}
        submitAction={fetchBooks}
      />
      <Fab color="primary" aria-label="create" onClick={handleAddDialogOpen}>
        <AddIcon />
      </Fab>
    </>
  );
}
