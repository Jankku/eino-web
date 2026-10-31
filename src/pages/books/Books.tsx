import { startTransition, useDeferredValue, useLayoutEffect } from 'react';
import { Box, SelectChangeEvent, Stack } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import { bookSortStatuses, bookSortFields } from '../../models/bookSortOptions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import ListDetailLayout from '../../components/layout/ListDetailLayout';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useBooksSuspense } from '../../data/books/useBooksSuspense';
import { useIsMobile } from '../../hooks/useIsMobile';
import BookActionsFab from '../../components/books/BookActionsFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';
import MoreButton from '../../components/common/MoreButton';
import Head from '../../components/common/Head';

export default function Books() {
  const isMobile = useIsMobile();
  const { bookId } = useParams();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const [searchparams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useLocalStorage('bookSort', 'all');
  const deferredStatus = useDeferredValue(status);
  const { itemType, toggleItemType } = useListItemType('bookItemType');
  const [addDialogOpen, toggleAddDialog] = useToggle(false);
  const { data, countByStatus } = useBooksSuspense({
    status: deferredStatus,
    sort: searchparams.get('sort'),
    order: searchparams.get('order'),
  });
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
    } catch {
      showErrorSnackbar('Failed to copy');
    }
  };

  const onSort = ({ key, value }: { key: string; value: string }) => {
    startTransition(() => {
      setSearchParams((prevParams) => {
        prevParams.set(key, value);
        return prevParams;
      });
    });
  };

  const onStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value);
    setSearchParams((prevParams) => {
      prevParams.delete('page');
      return prevParams;
    });
  };

  useLayoutEffect(() => {
    if (!searchparams.get('sort') || !searchparams.get('order')) {
      setSearchParams({ sort: 'title', order: 'ascending' });
    }
  }, [searchparams, setSearchParams]);

  return (
    <>
      {!bookId ? <Head pageTitle="Books" /> : null}
      <ListDetailLayout
        id={bookId}
        list={
          <Box sx={{ my: 2, mx: isMobile ? 2 : undefined }}>
            <Stack
              component="header"
              direction="row"
              sx={{
                flexWrap: 'wrap',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                rowGap: 1,
              }}
            >
              <Box>
                <Box component="h1" sx={{ m: 0 }}>
                  Books
                </Box>
              </Box>
              <Box>
                <Stack
                  component="ul"
                  aria-label="Actions"
                  direction="row"
                  sx={{ flexWrap: 'wrap', width: '100%', gap: 1, m: 0, p: 0, listStyle: 'none' }}
                >
                  {!isMobile ? (
                    <Box component="li" sx={{ display: 'inline-flex' }}>
                      <ResponsiveButton icon={<AddIcon />} onClick={toggleAddDialog as () => void}>
                        Create
                      </ResponsiveButton>
                    </Box>
                  ) : null}
                  <Box component="li" sx={{ display: 'inline-flex' }}>
                    <SortButton fieldOptions={bookSortFields} onChange={onSort} />
                  </Box>
                  <Box component="li" sx={{ display: 'inline-flex' }}>
                    <SmallSelect label="Status" value={status} onChange={onStatusChange}>
                      {bookSortStatuses.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name} ({countByStatus[option.value as keyof typeof countByStatus]}
                          )
                        </option>
                      ))}
                    </SmallSelect>
                  </Box>
                  <Box component="li" sx={{ display: 'inline-flex' }}>
                    <MoreButton
                      actions={[
                        { label: 'Copy', disabled: isEmptyList, onClick: copyTitlesToClipboard },
                        {
                          label: itemType === listItemTypes.CARD ? 'Image view' : 'Card view',
                          onClick: toggleItemType,
                        },
                      ]}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>

            {isEmptyList ? <ListEmpty /> : <BookList books={data} itemType={itemType} />}

            {addDialogOpen ? (
              <AddBookDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />
            ) : undefined}

            {isMobile ? <BookActionsFab onCreate={toggleAddDialog as () => void} /> : null}
          </Box>
        }
        detail={<Outlet />}
      />
    </>
  );
}
