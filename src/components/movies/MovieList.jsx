import { useState, useReducer } from 'react';
import { ImageList, Pagination, PaginationItem } from '@mui/material';
import EditMovieDialog from './EditMovieDialog';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import usePagination from '../../hooks/usePagination';
import { Link } from 'react-router-dom';

const itemsPerPage = 30;

export default function MovieList({ movies }) {
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const [editedMovieId, seteditedMovieId] = useState('');
  const columnCount = useColumnCalculator();
  const [items, page, pageCount] = usePagination(movies, itemsPerPage);

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedMovieId(itemId);
  };

  return (
    <>
      <Pagination
        showFirstButton
        showLastButton
        page={page}
        count={pageCount}
        boundaryCount={0}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/movies${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />

      <ImageList cols={columnCount} gap={6}>
        {items.map((movie) => (
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

      <Pagination
        showFirstButton
        showLastButton
        page={page}
        count={pageCount}
        boundaryCount={0}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/movies${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />

      <EditMovieDialog
        visible={editDialogOpen}
        closeDialog={toggleEditDialog}
        movieId={editedMovieId}
      />
    </>
  );
}
