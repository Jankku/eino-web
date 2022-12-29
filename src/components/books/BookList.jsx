import { useState, useReducer } from 'react';
import { ImageList, Pagination, PaginationItem } from '@mui/material';
import EditBookDialog from './EditBookDialog';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import usePagination from '../../hooks/usePagination';
import { Link } from 'react-router-dom';

const itemsPerPage = 30;

export default function BookList({ books }) {
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const [editedBookId, seteditedBookId] = useState('');
  const columnCount = useColumnCalculator();
  const [items, page, pageCount] = usePagination(books, itemsPerPage);

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
          <PaginationItem
            component={Link}
            to={`/books${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />

      <ImageList cols={columnCount} gap={6}>
        {items.map((book) => (
          <ListItem
            title={book.title}
            detailText={book.author}
            status={book.status}
            score={book.score}
            itemId={book.book_id}
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
          <PaginationItem
            component={Link}
            to={`/books${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />

      <EditBookDialog
        visible={editDialogOpen}
        closeDialog={toggleEditDialog}
        bookId={editedBookId}
      />
    </>
  );
}
