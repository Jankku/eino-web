import { ImageList, Pagination, PaginationItem } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import { usePagination } from '../../hooks/usePagination';
import { Link, useLocation } from 'react-router-dom';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';

const itemsPerPage = 21;

export default function BookList({ books, itemType }) {
  const columnCount = useColumnCalculator(itemType);
  const [items, page, pageCount] = usePagination(books, itemsPerPage);
  const { pathname } = useLocation();

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedBookId(itemId);
  };

  const pagination =
    books?.length > 0 ? (
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
    <>
      {pagination}
      <ImageList cols={columnCount} gap={12}>
        {items.map((book) => (
          <ListItemComponent
            title={book.title}
            detailText={book.author}
            status={book.status}
            score={book.score}
            itemId={book.book_id}
            imageUrl={book.image_url}
            onEditClick={onEditClick}
            key={book.book_id}
          />
        ))}
      </ImageList>
      {pagination}
    </>
  );
}
