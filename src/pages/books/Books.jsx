import { useReducer } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Container, Fab, Grid } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../../data/books/useBooks';

export default function Books() {
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [, setSearchParams] = useSearchParams();
  const [status, setStatus] = useLocalStorage('bookSort', 'all');
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useBooks(status);
  const bookCount = data?.length ?? 0;

  const onSortStatusChange = (e) => {
    setStatus(e.target.value);
    setSearchParams((prevParams) => prevParams.delete('page'));
  };

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Books ({bookCount})</h1>
        </Grid>
        <Grid item>
          <CopyItemButton
            data={data}
            isDisabled={bookCount === 0}
            onSuccess={() => showSuccessSnackbar('Items copied')}
            onFailure={() => showErrorSnackbar('Failed to copy')}
          />
          <SortStatusSelect status={status} onChange={onSortStatusChange}>
            {bookSortOptions.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
          </SortStatusSelect>
        </Grid>
      </Grid>

      <BookList books={data} />

      <AddBookDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

      <Fab color="primary" aria-label="Create book" onClick={toggleAddDialog}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
