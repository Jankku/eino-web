import React, { useState } from 'react';
import { styled } from '@mui/system';
import { ImageList } from '@mui/material';
import EditBookDialog from './EditBookDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';
import BookListItem from './BookListItem';

const PREFIX = 'BookList';

const classes = {
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-itemText`,
  cardActionsContainer: `${PREFIX}-cardActionsContainer`,
  cardActions: `${PREFIX}-cardActions`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.item}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.itemText}`]: {
    padding: '0.5em 0em 0em 0.5em',
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '11em',
  },

  [`& .${classes.cardActionsContainer}`]: {
    padding: '1em 0em 0em 0em',
    color: theme.palette.text.primary,
  },

  [`& .${classes.cardActions}`]: {
    color: theme.palette.text.primary,
  },
}));

export default function BookList({ books, fetchBooks }) {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedBookId, seteditedBookId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Root>
      <ImageList cols={ColumnCalculator()} gap={6}>
        {books.map((book) => (
          <BookListItem
            book={book}
            key={book.book_id}
            seteditedBookId={seteditedBookId}
            handleEditDialogOpen={handleEditDialogOpen}
          />
        ))}
      </ImageList>

      <EditBookDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        bookId={editedBookId}
        submitAction={fetchBooks}
      />
    </Root>
  );
}
