import { Box, ImageList, Pagination, PaginationItem } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import { usePagination } from '../../hooks/usePagination';
import { Link, useLocation, useSearchParams } from 'react-router';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';
import { useFilterSearchParams } from '../../hooks/useFilterSearchParams';
import { getPaginationUrl } from '../../utils/paginationUtil';
import { MovieWithId } from '../../models/movie';
import { useRestoreItemFocus } from '../../hooks/useRestoreItemFocus';

const itemsPerPage = 21;

type MovieListProps = {
  itemType: string;
  movies: MovieWithId[];
};

export default function MovieList({ itemType, movies }: MovieListProps) {
  const columnCount = useColumnCalculator(itemType);
  const [items, page, pageCount] = usePagination(movies, itemsPerPage);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const newSearchParams = useFilterSearchParams(searchParams, 'page');
  const { saveFocusedItem } = useRestoreItemFocus('movieFocusedItemId');

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  const pagination =
    movies?.length > 0 ? (
      <Pagination
        showFirstButton
        showLastButton
        page={page}
        count={pageCount}
        boundaryCount={0}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={getPaginationUrl({
              path: pathname,
              searchParams: newSearchParams,
              page: item.page || 1,
            })}
            {...item}
          />
        )}
      />
    ) : null;

  return (
    <Box component="section">
      {pagination}
      <ImageList cols={columnCount} gap={12}>
        {items.map((movie) => (
          <ListItemComponent
            key={movie.movie_id}
            title={movie.title}
            detailText={movie.director}
            status={movie.status}
            score={movie.score}
            itemId={movie.movie_id}
            imageUrl={movie.image_url}
            onNavigate={() => saveFocusedItem(movie.movie_id)}
          />
        ))}
      </ImageList>
      {pagination}
    </Box>
  );
}
