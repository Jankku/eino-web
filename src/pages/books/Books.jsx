import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Container, Fab, Grid, Select, Typography } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import { getBooks } from '../../data/Book';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useQuery, useQueryClient } from 'react-query';

export default function Books() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [bookSortStatus, setBookSortStatus] = useLocalStorage('bookSort', 'all');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(['books', bookSortStatus], () => getBooks(bookSortStatus), {
    initialData: () => {
      const cachedBooks = queryClient
        .getQueryData(['books', 'all'])
        ?.filter(({ status }) => status === bookSortStatus);
      return cachedBooks;
    },
    onError: () => showErrorSnackbar("Couldn't fetch books"),
  });

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
    <Container maxWidth="lg">
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

      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : data?.length > 0 ? (
        <BookList books={data} />
      ) : (
        <Grid container justifyContent="center">
          <Typography variant="h6">No books found</Typography>
        </Grid>
      )}

      <AddBookDialog visible={addDialogVisible} closeDialog={handleAddDialogCancel} />

      <Fab color="primary" aria-label="create" onClick={handleAddDialogOpen}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
