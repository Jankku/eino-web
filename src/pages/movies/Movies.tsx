import { startTransition, useDeferredValue, useLayoutEffect, useMemo } from 'react';
import { Box, Button, SelectChangeEvent, Stack } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import { movieSortStatuses, movieSortFields } from '../../models/movieSortOptions';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useMoviesSuspense } from '../../data/movies/useMoviesSuspense';
import { useServerPagination, useRecoverPage } from '../../hooks/useServerPagination';
import ListPagination from '../../components/common/ListPagination';
import ListDetailLayout from '../../components/layout/ListDetailLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType } from '../../hooks/useListItemType';
import ListEmpty from '../../components/common/ListEmpty';
import SortSelect from '../../components/common/SortSelect';
import ListViewToggle from '../../components/common/ListViewToggle';
import Head from '../../components/common/Head';

export default function Movies() {
  const isMobile = useIsMobile();
  const { movieId } = useParams();
  const [status, setStatus] = useLocalStorage('movieSort', 'all');
  const { itemType, toggleItemType } = useListItemType('movieItemType');
  const [searchparams, setSearchParams] = useSearchParams();
  const sort = searchparams.get('sort') || 'title';
  const order = searchparams.get('order') || 'ascending';
  const filter = searchparams.get('filter') || '';
  const { page, pageSize } = useServerPagination(25, JSON.stringify([status, sort, order, filter]));
  const [addDialogOpen, toggleAddDialog] = useToggle(false);
  // Local-storage updates are synchronous, so defer the complete query selection
  // to keep the current list and detail mounted while the next results load.
  const listParams = useMemo(
    () => ({ status, sort, order, filter, page, pageSize }),
    [status, sort, order, filter, page, pageSize],
  );
  const deferredListParams = useDeferredValue(listParams);
  const { data, countByStatus, pagination, isFetching } = useMoviesSuspense(deferredListParams);
  const isLoading = isFetching || listParams !== deferredListParams;
  useRecoverPage(pagination);
  const isEmptyList = countByStatus.all === 0;

  const onSort = ({ sort, order }: { sort: string; order: string }) => {
    startTransition(() => {
      setSearchParams((prevParams) => {
        prevParams.set('sort', sort);
        prevParams.set('order', order);
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
      {!movieId ? <Head pageTitle="Movies" /> : null}
      <ListDetailLayout
        id={movieId}
        list={
          <Box
            sx={{
              my: 2,
              mx: isMobile ? 2 : undefined,
            }}
          >
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
                <Box
                  component="h1"
                  sx={{
                    m: 0,
                  }}
                >
                  Movies
                </Box>
              </Box>
              <Box>
                <Stack
                  component="ul"
                  aria-label="Actions"
                  direction="row"
                  sx={{
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    gap: 1,
                    m: 0,
                    p: 0,
                    listStyle: 'none',
                  }}
                >
                  {!isMobile ? (
                    <Box component="li" sx={{ display: 'inline-flex' }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={toggleAddDialog as () => void}
                      >
                        Create
                      </Button>
                    </Box>
                  ) : null}
                  <Box component="li" sx={{ display: 'inline-flex' }}>
                    <ListViewToggle itemType={itemType} onToggle={toggleItemType} />
                  </Box>
                  <Box component="li" sx={{ display: 'inline-flex' }}>
                    <SmallSelect label="Status" value={status} onChange={onStatusChange}>
                      {movieSortStatuses.map((option) => (
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
                <ListPagination
                  pagination={pagination}
                  loading={isLoading}
                  label="Movies"
                  actions={<SortSelect fieldOptions={movieSortFields} onChange={onSort} />}
                />
                <MovieList movies={data} itemType={itemType} />
                {data.length > 0 ? <ListPagination pagination={pagination} label="Movies" /> : null}
              </>
            )}

            {addDialogOpen ? (
              <AddMovieDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />
            ) : undefined}

            {isMobile ? <CreateFab onClick={toggleAddDialog as () => void} /> : null}
          </Box>
        }
        detail={<Outlet />}
      />
    </>
  );
}
