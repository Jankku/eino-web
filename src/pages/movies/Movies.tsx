import { startTransition, useLayoutEffect } from 'react';
import { Box, SelectChangeEvent, Stack } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import { movieSortStatuses, movieSortFields } from '../../models/movieSortOptions';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useMoviesSuspense } from '../../data/movies/useMoviesSuspense';
import { useServerPagination, useRecoverPage } from '../../hooks/useServerPagination';
import ListPagination from '../../components/common/ListPagination';
import ListDetailLayout from '../../components/layout/ListDetailLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';
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
  const pageParams = useServerPagination(25, JSON.stringify([status, sort, order, filter]));
  const [addDialogOpen, toggleAddDialog] = useToggle(false);
  const { data, countByStatus, pagination, isFetching } = useMoviesSuspense({
    status,
    sort,
    order,
    filter,
    ...pageParams,
  });
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
                  sx={{ flexWrap: 'wrap', width: '100%', gap: 1, m: 0, p: 0, listStyle: 'none' }}
                >
                  {!isMobile ? (
                    <Box
                      component="li"
                      sx={{
                        display: 'inline-flex',
                      }}
                    >
                      <ResponsiveButton icon={<AddIcon />} onClick={toggleAddDialog as () => void}>
                        Create
                      </ResponsiveButton>
                    </Box>
                  ) : null}
                  <Box
                    component="li"
                    sx={{
                      display: 'inline-flex',
                    }}
                  >
                    <SortButton fieldOptions={movieSortFields} onChange={onSort} />
                  </Box>
                  <Box
                    component="li"
                    sx={{
                      display: 'inline-flex',
                    }}
                  >
                    <SmallSelect label="Status" value={status} onChange={onStatusChange}>
                      {movieSortStatuses.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name} ({countByStatus[option.value as keyof typeof countByStatus]}
                          )
                        </option>
                      ))}
                    </SmallSelect>
                  </Box>
                  <Box
                    component="li"
                    sx={{
                      display: 'inline-flex',
                    }}
                  >
                    <ResponsiveButton
                      icon={itemType === listItemTypes.CARD ? <ImageIcon /> : <ViewAgendaIcon />}
                      onClick={toggleItemType}
                    >
                      {itemType === listItemTypes.CARD ? 'Image view' : 'Card view'}
                    </ResponsiveButton>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            {isEmptyList ? (
              <ListEmpty />
            ) : (
              <>
                <ListPagination pagination={pagination} loading={isFetching} label="Movies" />
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
