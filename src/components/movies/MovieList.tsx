import { Box, Stack, ImageList, Typography } from '@mui/material';
import { useColumnCalculator } from '../../hooks/useColumnCalculator';
import ListItem from '../common/ListItem';
import ListItemImage from '../common/ListItemImage';
import { listItemTypes } from '../../hooks/useListItemType';
import { MovieWithId } from '../../models/movie';
import { useRestoreItemFocus } from '../../hooks/useRestoreItemFocus';

type MovieListProps = {
  itemType: string;
  movies: MovieWithId[];
};

export default function MovieList({ itemType, movies }: MovieListProps) {
  const columnCount = useColumnCalculator(itemType);
  const { getItemLinkState } = useRestoreItemFocus();

  const ListItemComponent = itemType === listItemTypes.CARD ? ListItem : ListItemImage;

  if (movies.length === 0) {
    return (
      <Stack sx={{ alignItems: 'center', pt: 3 }}>
        <Typography variant="h6">No movies match these filters</Typography>
        <Typography sx={{ pt: 1 }}>Try changing the status or filters!</Typography>
      </Stack>
    );
  }

  return (
    <Box component="section">
      <ImageList cols={columnCount} gap={12}>
        {movies.map((movie) => (
          <ListItemComponent
            key={movie.movie_id}
            title={movie.title}
            detailText={movie.director}
            status={movie.status}
            score={movie.score}
            itemId={movie.movie_id}
            imageUrl={movie.image_url}
            navigationState={getItemLinkState(movie.movie_id)}
          />
        ))}
      </ImageList>
    </Box>
  );
}
