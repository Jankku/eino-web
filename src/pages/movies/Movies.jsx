import { useReducer } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Container, Fab, Grid } from '@mui/material';
import AddMovieDialog from '../../components/movies/AddMovieDialog';
import MovieList from '../../components/movies/MovieList';
import movieSortOptions from '../../models/movieSortOptions';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import useLocalStorage from '../../hooks/useLocalStorage';
import SortStatusSelect from '../../components/common/SortStatusSelect';
import CopyItemButton from '../../components/common/CopyItemButton';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../../data/movies/useMovies';

export default function Movies() {
  const { showErrorSnackbar, showSuccessSnackbar } = useCustomSnackbar();
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
    <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <h1>Movies ({movieCount})</h1>
        </Grid>
        <Grid item>
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

      <MovieList movies={data} />

      <AddMovieDialog visible={addDialogOpen} closeDialog={toggleAddDialog} />

      <Fab color="primary" aria-label="create movie" onClick={toggleAddDialog}>
        <AddIcon />
      </Fab>
    </Container>
  );
}
