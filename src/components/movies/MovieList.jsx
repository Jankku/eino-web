import React, { useState } from 'react';
import { styled } from '@mui/system';
import { ImageList } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditMovieDialog from './EditMovieDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';
import MovieListItem from '../../components/movies/MovieListItem';

const PREFIX = 'MovieList';

const classes = {
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-itemText`,
  cardActionsContainer: `${PREFIX}-cardActionsContainer`,
  cardActions: `${PREFIX}-cardActions`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.item}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.itemText}`]: {
    padding: '0.5em 0em 0em 0.5em',
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '11em',
  },

  [`& .${classes.cardActionsContainer}`]: {
    padding: '1em 0em 0em 0em',
    color: theme.palette.text.primary,
  },

  [`& .${classes.cardActions}`]: {
    color: theme.palette.text.primary,
  },
}));

export default function MovieList({ movies, fetchMovies }) {
  const navigate = useNavigate();

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedMovieId, seteditedMovieId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Root>
      <ImageList cols={ColumnCalculator()} gap={6}>
        {movies.map((movie) => (
          <MovieListItem
            movie={movie}
            key={movie.movie_id}
            seteditedMovieId={seteditedMovieId}
            handleEditDialogOpen={handleEditDialogOpen}
          />
        ))}
      </ImageList>

      <EditMovieDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        movieId={editedMovieId}
        submitAction={fetchMovies}
      />
    </Root>
  );
}
