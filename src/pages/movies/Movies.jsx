import { useReducer } from 'react';
import { Box, Grid } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { useMovies } from '../../data/movies/useMovies';
import ListDetailLayout from '../../components/common/ListDetailLayout';
import useIsMobile from '../../hooks/useIsMobile';
import CreateFab from '../../components/common/CreateFab';
import CreateButton from '../../components/common/CreateButton';

export default function Movies() {
  const isMobile = useIsMobile();
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
  const { movieId } = useParams();
  const [status, setStatus] = useLocalStorage('movieSort', 'all');
  const [, setSearchParams] = useSearchParams();
  const [addDialogOpen, toggleAddDialog] = useReducer((open) => !open, false);
  const { data } = useMovies(status);
  const movieCount = data?.length ?? 0;

  const onSortStatusChange = (e) => {
    setStatus(e.target.value);
    setSearchParams((prevParams) => prevParams.delete('page'));
  };

  return (
    <ListDetailLayout
      id={movieId}
      list={
        <Box mx={isMobile ? 2 : undefined}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <h1>Movies ({movieCount})</h1>
            </Grid>
            <Grid item>
              <Grid container item flexDirection="row" gap={1}>
                {!isMobile ? <CreateButton onClick={toggleAddDialog} /> : null}
                <CopyItemButton
                  data={data}
                  isDisabled={movieCount === 0}
                  onSuccess={() => showSuccessSnackbar('Items copied')}
                  onFailure={() => showErrorSnackbar('Failed to copy')}
                />
                <SortStatusSelect status={status} onChange={onSortStatusChange}>
                  {movieSortOptions.map((item, itemIdx) => (
                    <option key={itemIdx} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </SortStatusSelect>
              </Grid>
            </Grid>
          </Grid>

          <MovieList movies={data} />

          <AddMovieDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

          {isMobile ? <CreateFab onClick={toggleAddDialog} /> : null}
        </Box>
      }
      detail={<Outlet />}
    />
  );
}
