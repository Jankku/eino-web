import { useState, useReducer } from 'react';
import { ImageList } from '@mui/material';
import EditBookDialog from './EditBookDialog';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';

export default function BookList({ books }) {
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const [editedBookId, seteditedBookId] = useState('');

  const onEditClick = (itemId) => {
    toggleEditDialog();
    seteditedBookId(itemId);
  };

  return (
    <>
      <ImageList cols={useColumnCalculator()} gap={6}>
        {books.map((book) => (
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

      <EditBookDialog
        visible={editDialogOpen}
        closeDialog={toggleEditDialog}
        bookId={editedBookId}
      />
    </>
  );
}
