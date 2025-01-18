import { Box, ImageList, Pagination, PaginationItem } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import { usePagination } from '../../hooks/usePagination';
import { Link, useLocation, useSearchParams } from 'react-router';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';
import { useFilterSearchParams } from '../../hooks/useFilterSearchParams';
import { getPaginationUrl } from '../../utils/paginationUtil';
import { BookWithId } from '../../models/book';
import { useRestoreItemFocus } from '../../hooks/useRestoreItemFocus';

const itemsPerPage = 21;

type BookListProps = {
  books: BookWithId[];
  itemType: string;
};

export default function BookList({ books, itemType }: BookListProps) {
  const columnCount = useColumnCalculator(itemType);
  const [items, page, pageCount] = usePagination(books, itemsPerPage);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const newSearchParams = useFilterSearchParams(searchParams, 'page');
  const { saveFocusedItem } = useRestoreItemFocus('bookFocusedItemId');

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  const pagination =
    books?.length > 0 ? (
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
        {items.map((book) => (
          <ListItemComponent
            key={book.book_id}
            title={book.title}
            detailText={book.author}
            status={book.status}
            score={book.score}
            itemId={book.book_id}
            imageUrl={book.image_url}
            onNavigate={() => saveFocusedItem(book.book_id)}
          />
        ))}
      </ImageList>
      {pagination}
    </Box>
  );
}
