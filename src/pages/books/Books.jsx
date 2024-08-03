import { useReducer, startTransition, useLayoutEffect } from 'react';
import { Box, Grid } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import { bookSortStatuses, bookSortFields } from '../../models/bookSortOptions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useBooks } from '../../data/books/useBooks';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListItemTypeButton from '../../components/common/ListItemTypeButton';
import useBookCount from './useBookCount';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';

export default function Books() {
  const isMobile = useIsMobile();
  const { bookId } = useParams();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [searchparams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useLocalStorage('bookSort', 'all');
  const { itemType, toggleItemType } = useListItemType('bookItemType', listItemTypes.CARD);
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useBooks({
    status,
    sort: searchparams.get('sort'),
    order: searchparams.get('order'),
  });
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
      showSuccessSnackbar('Items copied to clipboard');
    } catch (error) {
      showErrorSnackbar('Failed to copy');
    }
  };

  const onSort = ({ key, value }) => {
    startTransition(() => {
      setSearchParams((prevParams) => {
        prevParams.set(key, value);
        return prevParams;
      });
    });
  };

  const onStatusChange = (e) => {
    startTransition(() => {
      setStatus(e.target.value);
      setSearchParams((prevParams) => {
        prevParams.delete('page');
        return prevParams;
      });
    });
  };

  useLayoutEffect(() => {
    startTransition(() => {
      setSearchParams({ sort: 'title', order: 'ascending' });
    });
  }, []);

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
                    <ResponsiveButton icon={<AddIcon />} onClick={toggleAddDialog}>
                      Create
                    </ResponsiveButton>
                  </Box>
                ) : null}
                <Box component="li" display="inline-flex">
                  <ListItemTypeButton itemType={itemType} onClick={toggleItemType} />
                </Box>
                <Box component="li" display="inline-flex">
                  <ResponsiveButton
                    icon={<ContentCopyIcon />}
                    disabled={isEmptyList}
                    onClick={copyTitlesToClipboard}
                  >
                    Copy
                  </ResponsiveButton>
                </Box>
                <Box component="li" display="inline-flex">
                  <SortButton fieldOptions={bookSortFields} onChange={onSort} />
                </Box>
                <Box component="li" display="inline-flex">
                  <SmallSelect value={status} onChange={onStatusChange}>
                    {bookSortStatuses.map((option, itemIdx) => (
                      <option key={itemIdx} value={option.value}>
                        {option.name} ({countByStatus[option.value]})
                      </option>
                    ))}
                  </SmallSelect>
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
