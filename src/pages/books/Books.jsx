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
import CopyItemButton from '../../components/common/CopyItemButton';

export default function Books() {
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [sortStatus, setSortStatus] = useLocalStorage('bookSort', 'all');
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(['books', sortStatus], () => getBooks(sortStatus), {
    initialData: () =>
      queryClient.getQueryData(['books', 'all'])?.filter(({ status }) => status === sortStatus),
    onError: () => showErrorSnackbar("Couldn't fetch books"),
  });
  const bookCount = data?.length ?? 0;

  const onSortStatusChange = (e) => setSortStatus(e.target.value);

  const onCopySuccess = () => showSuccessSnackbar('Items copied');
  const onCopyFailure = () => showErrorSnackbar('Failed to copy');

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Books ({bookCount})</h1>
        </Grid>
        <Grid item>
          <CopyItemButton
            data={data}
            isDisabled={bookCount === 0}
            onSuccess={onCopySuccess}
            onFailure={onCopyFailure}
          />
          <SortStatusSelect status={sortStatus} onChange={onSortStatusChange}>
            {bookSortOptions.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
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
