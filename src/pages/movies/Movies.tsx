import { useReducer, startTransition, useLayoutEffect } from 'react';
import {
  Box,
  Grid,
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
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SmallSelect from '../../components/common/SmallSelect';
import AddIcon from '@mui/icons-material/Add';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useMovies } from '../../data/movies/useMovies';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import useMovieCount from './useMovieCount';
import ListEmpty from '../../components/common/ListEmpty';
import SortButton from '../../components/common/SortButton';
import ResponsiveButton from '../../components/common/ResponsiveButton';
import MoreButton from '../../components/common/MoreButton';

export default function Movies() {
  const isMobile = useIsMobile();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const { movieId } = useParams();
  const [status, setStatus] = useLocalStorage('movieSort', 'all');
  const { itemType, toggleItemType } = useListItemType('movieItemType', listItemTypes.CARD);
  const [searchparams, setSearchParams] = useSearchParams();
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useMovies({
    status,
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
    startTransition(() => {
      setStatus(e.target.value);
      setSearchParams((prevParams) => {
        prevParams.delete('page');
        return prevParams;
      });
    });
  };

  useLayoutEffect(() => {
    setSearchParams({ sort: 'title', order: 'ascending' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListDetailLayout
      id={movieId}
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
                Movies
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
                  <SortButton fieldOptions={movieSortFields} onChange={onSort} />
                </Box>
                <Box component="li" display="inline-flex">
                  <SmallSelect label="Status" value={status} onChange={onStatusChange}>
                    {movieSortStatuses.map((option, itemIdx) => (
                      <option key={itemIdx} value={option.value}>
                        {option.name} ({countByStatus[option.value]})
                      </option>
                    ))}
                  </SmallSelect>
                </Box>
                <Box component="li" display="inline-flex">
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
              </Grid>
            </Grid>
          </Grid>

          {isEmptyList ? <ListEmpty /> : <MovieList movies={data} itemType={itemType} />}

          <AddMovieDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

          {isMobile ? <CreateFab onClick={toggleAddDialog} /> : null}
        </Box>
      }
      detail={<Outlet />}
    />
  );
}
