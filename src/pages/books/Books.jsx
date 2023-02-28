import { useReducer } from 'react';
import { Box, Grid } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useBooks } from '../../data/books/useBooks';
import useIsMobile from '../../hooks/useIsMobile';
import CreateButton from '../../components/common/CreateButton';
import CreateFab from '../../components/common/CreateFab';

export default function Books() {
  const isMobile = useIsMobile();
  const { bookId } = useParams();
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
    <ListDetailLayout
      id={bookId}
      list={
        <Box mx={isMobile ? 2 : undefined}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <h1>Books ({bookCount})</h1>
            </Grid>
            <Grid item>
              <Grid container item flexDirection="row" gap={1}>
                {!isMobile ? <CreateButton onClick={toggleAddDialog} /> : null}
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
          </Grid>

          <BookList books={data} />

          <AddBookDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

          {isMobile ? <CreateFab onClick={toggleAddDialog} /> : null}
        </Box>
      }
      detail={<Outlet />}
    />
  );
}
