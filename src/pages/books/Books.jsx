import { useReducer } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Container, Fab, Grid, Typography } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import { getBooks } from '../../data/Book';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useQuery, useQueryClient } from 'react-query';
import SortStatusSelect from '../../components/common/SortStatusSelect';

export default function Books() {
  const { showErrorSnackbar } = useCustomSnackbar();
  const [sortStatus, setSortStatus] = useLocalStorage('bookSort', 'all');
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(['books', sortStatus], () => getBooks(sortStatus), {
    initialData: () =>
      queryClient.getQueryData(['books', 'all'])?.filter(({ status }) => status === sortStatus),
    onError: () => showErrorSnackbar("Couldn't fetch books"),
  });

  const onSortStatusChange = (e) => setSortStatus(e.target.value);

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Books</h1>
        </Grid>
        <Grid item>
          <SortStatusSelect status={sortStatus} onChange={onSortStatusChange}>
            {bookSortOptions.map((item, itemIdx) => {
              return (
                <option key={itemIdx} value={item.value}>
                  {item.name}
                </option>
              );
            })}
          </SortStatusSelect>
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

      <AddBookDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

      <Fab color="primary" aria-label="create" onClick={toggleAddDialog}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
