import { ImageList, Pagination, PaginationItem } from '@mui/material';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import usePagination from '../../hooks/usePagination';
import { Link, useLocation } from 'react-router-dom';

const itemsPerPage = 21;

export default function MovieList({ movies }) {
  const columnCount = useColumnCalculator();
  const [items, page, pageCount] = usePagination(movies, itemsPerPage);
  const { pathname } = useLocation();

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
          <PaginationItem component={Link} to={`${pathname}?page=${item.page}`} {...item} />
        )}
      />

      <ImageList cols={columnCount} gap={12}>
        {items.map((movie) => (
          <ListItem
            title={movie.title}
            detailText={movie.director}
            status={movie.status}
            score={movie.score}
            itemId={movie.movie_id}
            imageUrl={movie.image_url}
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
          <PaginationItem component={Link} to={`${pathname}?page=${item.page}`} {...item} />
        )}
        sx={{ mb: 2 }}
      />
    </>
  );
}
