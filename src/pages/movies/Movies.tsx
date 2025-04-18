import { startTransition, useDeferredValue, useLayoutEffect } from 'react';
import {
  Box,
  GridLegacy,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import { movieSortStatuses, movieSortFields } from '../../models/movieSortOptions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useLocalStorage, useToggle } from '@uidotdev/usehooks';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import { Outlet, useParams, useSearchParams } from 'react-router';
import { useMoviesSuspense } from '../../data/movies/useMoviesSuspense';
import ListDetailLayout from '../../components/layout/ListDetailLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';
import MoreButton from '../../components/common/MoreButton';
import Head from '../../components/common/Head';
import { useMovieCount } from '../../data/movies/useMovieCount';

export default function Movies() {
  const isMobile = useIsMobile();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const { movieId } = useParams();
  const [status, setStatus] = useLocalStorage('movieSort', 'all');
  const deferredStatus = useDeferredValue(status);
  const { itemType, toggleItemType } = useListItemType('movieItemType');
  const [searchparams, setSearchParams] = useSearchParams();
  const [addDialogOpen, toggleAddDialog] = useToggle(false);
  const { data } = useMoviesSuspense({
    status: deferredStatus,
    sort: searchparams.get('sort'),
    order: searchparams.get('order'),
  });
  const countByStatus = useMovieCount();
  const isEmptyList = countByStatus.all === 0;

  const copyTitlesToClipboard = async () => {
    try {
      const items = data
        .filter((i) => i.title !== '')
        .map((i) => {
          if (i.director) return `${i.director} - ${i.title}`;
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
      <Head pageTitle="Movies" />
      <ListDetailLayout
        id={movieId}
        list={
          <Box
            sx={{
              my: 2,
              mx: isMobile ? 2 : undefined,
            }}
          >
            <GridLegacy
              container
              component="header"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                rowGap: 1,
              }}
            >
              <GridLegacy item>
                <Box
                  component="h1"
                  sx={{
                    m: 0,
                  }}
                >
                  Movies
                </Box>
              </GridLegacy>
              <GridLegacy item>
                <GridLegacy
                  container
                  item
                  component="ul"
                  aria-label="Actions"
                  sx={{
                    gap: 1,
                    p: 0,
                    listStyle: 'none',
                  }}
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
                      {movieSortStatuses.map((option, itemIdx) => (
                        <option key={itemIdx} value={option.value}>
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
                    <MoreButton>
                      <List disablePadding>
                        <ListItem disablePadding>
                          <ListItemButton disabled={isEmptyList} onClick={copyTitlesToClipboard}>
                            <ListItemText primary="Copy" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton onClick={toggleItemType}>
                            <ListItemText
                              primary={itemType === listItemTypes.CARD ? 'Image view' : 'Card view'}
                            />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </MoreButton>
                  </Box>
                </GridLegacy>
              </GridLegacy>
            </GridLegacy>

            {isEmptyList ? <ListEmpty /> : <MovieList movies={data} itemType={itemType} />}

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
