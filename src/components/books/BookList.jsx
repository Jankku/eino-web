import { useState } from 'react';
import { ImageList } from '@mui/material';
import EditBookDialog from './EditBookDialog';
import useColumnCalculator from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';

export default function BookList({ books }) {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedBookId, seteditedBookId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

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
            setEditedItemId={seteditedBookId}
            handleEditDialogOpen={handleEditDialogOpen}
            key={book.book_id}
          />
        ))}
      </ImageList>

      <EditBookDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        bookId={editedBookId}
      />
    </>
  );
}
