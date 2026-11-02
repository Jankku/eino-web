import { startTransition, useDeferredValue, useLayoutEffect, useMemo } from 'react';
import { Box, SelectChangeEvent, Stack } from '@mui/material';
import AddBookDialog from '../../components/books/AddBookDialog';
import BookList from '../../components/books/BookList';
import { bookSortStatuses, bookSortFields } from '../../models/bookSortOptions';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ListDetailLayout from '../../components/layout/ListDetailLayout';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useBooksSuspense } from '../../data/books/useBooksSuspense';
import { useServerPagination, useRecoverPage } from '../../hooks/useServerPagination';
import ListPagination from '../../components/common/ListPagination';
import { useIsMobile } from '../../hooks/useIsMobile';
import BookActionsFab from '../../components/books/BookActionsFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';
import Head from '../../components/common/Head';

export default function Books() {
  const isMobile = useIsMobile();
  const { bookId } = useParams();
  const [searchparams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useLocalStorage('bookSort', 'all');
  const sort = searchparams.get('sort') || 'title';
  const order = searchparams.get('order') || 'ascending';
  const filter = searchparams.get('filter') || '';
  const { page, pageSize } = useServerPagination(25, JSON.stringify([status, sort, order, filter]));
  const { itemType, toggleItemType } = useListItemType('bookItemType');
  const [addDialogOpen, toggleAddDialog] = useToggle(false);
  // Local-storage updates are synchronous, so defer the complete query selection
  // to keep the current list and detail mounted while the next results load.
  const listParams = useMemo(
    () => ({ status, sort, order, filter, page, pageSize }),
    [status, sort, order, filter, page, pageSize],
  );
  const deferredListParams = useDeferredValue(listParams);
  const { data, countByStatus, pagination, isFetching } = useBooksSuspense(deferredListParams);
  const isLoading = isFetching || listParams !== deferredListParams;
  useRecoverPage(pagination);
  const isEmptyList = countByStatus.all === 0;

  const onSort = ({ key, value }: { key: string; value: string }) => {
    startTransition(() => {
      setSearchParams((prevParams) => {
        prevParams.set(key, value);
        prevParams.delete('page');
        return prevParams;
      });
    });
  };

  const onStatusChange = (e: SelectChangeEvent) => {
    startTransition(() => {
      setStatus(e.target.value);
      setSearchParams((prevParams) => {
        prevParams.delete('page');
        return prevParams;
      });
    });
  };

  useLayoutEffect(() => {
    if (!searchparams.get('sort') || !searchparams.get('order')) {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (!next.get('sort')) next.set('sort', 'title');
          if (!next.get('order')) next.set('order', 'ascending');
          return next;
        },
        { replace: true },
      );
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
                    <ResponsiveButton
                      icon={itemType === listItemTypes.CARD ? <ImageIcon /> : <ViewAgendaIcon />}
                      onClick={toggleItemType}
                    >
                      {itemType === listItemTypes.CARD ? 'Image view' : 'Card view'}
                    </ResponsiveButton>
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
                </Stack>
              </Box>
            </Stack>

            {isEmptyList ? (
              <ListEmpty />
            ) : (
              <>
                <ListPagination pagination={pagination} loading={isLoading} label="Books" />
                <BookList books={data} itemType={itemType} />
                {data.length > 0 ? <ListPagination pagination={pagination} label="Books" /> : null}
              </>
            )}

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
