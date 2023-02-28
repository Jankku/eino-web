import { ImageList, Pagination, PaginationItem } from '@mui/material';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import usePagination from '../../hooks/usePagination';
import { Link, useLocation } from 'react-router-dom';

const itemsPerPage = 21;

export default function BookList({ books }) {
  const columnCount = useColumnCalculator();
  const [items, page, pageCount] = usePagination(books, itemsPerPage);
  const { pathname } = useLocation();

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedBookId(itemId);
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
        {items.map((book) => (
          <ListItem
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
