import { useState, useReducer } from 'react';
import { ImageList } from '@mui/material';
import EditMovieDialog from './EditMovieDialog';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';

export default function MovieList({ movies }) {
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const [editedMovieId, seteditedMovieId] = useState('');

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedMovieId(itemId);
  };

  return (
    <>
      <ImageList cols={useColumnCalculator()} gap={6}>
        {movies.map((movie) => (
          <ListItem
            title={movie.title}
            detailText={movie.director}
            status={movie.status}
            score={movie.score}
            itemId={movie.movie_id}
            onEditClick={onEditClick}
            key={movie.movie_id}
          />
        ))}
      </ImageList>

      <EditMovieDialog
        visible={editDialogOpen}
        closeDialog={toggleEditDialog}
        movieId={editedMovieId}
      />
    </>
  );
}
