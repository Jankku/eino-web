import { useReducer, startTransition } from 'react';
import { Box, Grid } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useMovies } from '../../data/movies/useMovies';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import { useIsMobile } from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import CreateButton from '../../components/common/CreateButton';
import { useListItemType, listItemTypes } from '../../hooks/useListItemType';
import ListItemTypeButton from '../../components/common/ListItemTypeButton';
import useMovieCount from './useMovieCount';
import ListEmpty from '../../components/common/ListEmpty';

export default function Movies() {
  const isMobile = useIsMobile();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const { movieId } = useParams();
  const [status, setStatus] = useLocalStorage('movieSort', 'all');
  const { itemType, toggleItemType } = useListItemType('movieItemType', listItemTypes.CARD);
  const [, setSearchParams] = useSearchParams();
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useMovies(status);
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
                    {movieSortOptions.map((option, itemIdx) => (
                      <option key={itemIdx} value={option.value}>
                        {option.name} ({countByStatus[option.value]})
                      </option>
                    ))}
                  </SortStatusSelect>
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
