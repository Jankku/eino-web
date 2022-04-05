import { useState } from 'react';
import { ImageList } from '@mui/material';
import EditMovieDialog from './EditMovieDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';
import ListItem from '../common/ListItem';

export default function MovieList({ movies, fetchMovies }) {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedMovieId, seteditedMovieId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <>
      <ImageList cols={ColumnCalculator()} gap={6}>
        {movies.map((movie) => (
          <ListItem
            title={movie.title}
            detailText={movie.studio}
            status={movie.status}
            score={movie.score}
            itemId={movie.movie_id}
            setEditedItemId={seteditedMovieId}
            handleEditDialogOpen={handleEditDialogOpen}
            key={movie.movie_id}
          />
        ))}
      </ImageList>

      <EditMovieDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        movieId={editedMovieId}
        submitAction={fetchMovies}
      />
    </>
  );
}
