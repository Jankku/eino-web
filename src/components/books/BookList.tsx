import { Box, Stack, ImageList, Typography } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';
import { BookWithId } from '../../models/book';
import { useRestoreItemFocus } from '../../hooks/useRestoreItemFocus';

type BookListProps = {
  books: BookWithId[];
  itemType: string;
};

export default function BookList({ books, itemType }: BookListProps) {
  const columnCount = useColumnCalculator(itemType);
  const { getItemLinkState } = useRestoreItemFocus();

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  if (books.length === 0) {
    return (
      <Stack sx={{ alignItems: 'center', pt: 3 }}>
        <Typography variant="h6">No books match these filters</Typography>
        <Typography sx={{ pt: 1 }}>Try changing the status or filters!</Typography>
      </Stack>
    );
  }

  return (
    <Box component="section">
      <ImageList cols={columnCount} gap={12}>
        {books.map((book) => (
          <ListItemComponent
            key={book.book_id}
            title={book.title}
            detailText={book.author}
            status={book.status}
            score={book.score}
            itemId={book.book_id}
            imageUrl={book.image_url}
            navigationState={getItemLinkState(book.book_id)}
          />
        ))}
      </ImageList>
    </Box>
  );
}
