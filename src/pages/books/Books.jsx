import { useReducer, startTransition } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import bookSortOptions from '../../models/bookSortOptions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useBooks } from '../../data/books/useBooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateButton from '../../components/common/CreateButton';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListItemTypeButton from '../../components/common/ListItemTypeButton';
import useBookCount from './useBookCount';
import ListEmpty from '../../components/common/ListEmpty';

export default function Books() {
  const isMobile = useIsMobile();
  const { bookId } = useParams();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [, setSearchParams] = useSearchParams();
  const [status, setStatus] = useLocalStorage('bookSort', 'all');
  const { itemType, toggleItemType } = useListItemType('bookItemType', listItemTypes.CARD);
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useBooks(status);
  const countByStatus = useBookCount();
  const isEmptyList = countByStatus.all === 0;

  const copyTitlesToClipboard = async () => {
    try {
      const items = data
        .filter((i) => i.title !== '')
        .map((i) => {
          if (i.author) return `${i.author} - ${i.title}`;
          return i.title;
        })
        .join('\n');
      await navigator.clipboard.writeText(items);
      showSuccessSnackbar('Items copied');
    } catch (error) {
      showErrorSnackbar('Failed to copy');
    }
  };

  const onSortStatusChange = (e) => {
    startTransition(() => {
      setStatus(e.target.value);
      setSearchParams((prevParams) => prevParams.delete('page'));
    });
  };

  return (
    <ListDetailLayout
      id={bookId}
      list={
        <Box my={2} mx={isMobile ? 2 : undefined}>
          <Grid
            container
            component="header"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            sx={{ rowGap: 1 }}
          >
            <Grid item>
              <Box component="h1" m={0}>
                Books
              </Box>
            </Grid>
            <Grid item>
              <Grid
                container
                item
                component="ul"
                aria-label="Actions"
                gap={1}
                p={0}
                sx={{ listStyle: 'none' }}
              >
                {!isMobile ? (
                  <Box component="li" display="inline-flex">
                    <CreateButton onClick={toggleAddDialog} />
                  </Box>
                ) : null}
                <Box component="li" display="inline-flex">
                  <ListItemTypeButton itemType={itemType} onClick={toggleItemType} />
                </Box>
                <Box component="li" display="inline-flex">
                  <CopyItemButton disabled={isEmptyList} onClick={copyTitlesToClipboard} />
                </Box>
                <Box component="li" display="inline-flex">
                  <SortStatusSelect status={status} onChange={onSortStatusChange}>
                    {bookSortOptions.map((option, itemIdx) => (
                      <option key={itemIdx} value={option.value}>
                        {option.name} ({countByStatus[option.value]})
                      </option>
                    ))}
                  </SortStatusSelect>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {isEmptyList ? <ListEmpty /> : <BookList books={data} itemType={itemType} />}

          <AddBookDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

          {isMobile ? <CreateFab onClick={toggleAddDialog} /> : null}
        </Box>
      }
      detail={<Outlet />}
    />
  );
}
