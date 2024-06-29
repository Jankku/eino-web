import { Box, ImageList, Pagination, PaginationItem } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import { usePagination } from '../../hooks/usePagination';
import { Link, useLocation } from 'react-router-dom';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';

const itemsPerPage = 21;

export default function MovieList({ itemType, movies }) {
  const columnCount = useColumnCalculator(itemType);
  const [items, page, pageCount] = usePagination(movies, itemsPerPage);
  const { pathname } = useLocation();

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedMovieId(itemId);
  };

  const pagination =
    movies?.length > 0 ? (
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
    ) : null;

  return (
    <Box component="section">
      {pagination}
      <ImageList cols={columnCount} gap={12}>
        {items.map((movie) => (
          <ListItemComponent
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
      {pagination}
    </Box>
  );
}
