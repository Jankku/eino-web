import { CircularProgress, Grid, ImageList, ImageListItem, Link, Typography } from '@mui/material';
import { useBookCovers } from '../../data/books/useBookCovers';
import ImageDialog from '../common/ImageDialog';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function CoverDialog({ visible, closeDialog, query, onSelect }) {
  const { isDark } = useThemeContext();
  const bookCovers = useBookCovers(visible, query);

  return (
    <ImageDialog
      title="Find book cover"
      sources={
        <>
          <Link href="https://finna.fi/" target="_blank" rel="noreferrer">
            Finna
          </Link>
          ,{' '}
          <Link href="https://openlibrary.org/" target="_blank" rel="noreferrer">
            Open Library
          </Link>
        </>
      }
      visible={visible}
      closeDialog={closeDialog}
    >
      {bookCovers.isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : null}
      {bookCovers.isLoadingError ? <Typography pt={2}>Failed to load covers.</Typography> : null}
      {bookCovers.data?.length > 0 ? (
        <ImageList cols={3} sx={{ width: '600', height: '100%' }}>
          {bookCovers.data?.map((coverUrl) => (
            <ImageListItem
              key={coverUrl}
              sx={{
                justifySelf: 'center',
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                width: '200',
                height: '100%',
              }}
            >
              <img
                loading="lazy"
                alt="Book cover"
                referrerPolicy="no-referrer"
                src={coverUrl}
                style={{ objectFit: 'cover', aspectRatio: 0.7 }}
                onClick={() => onSelect(coverUrl)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography pt={2}>No covers found.</Typography>
      )}
    </ImageDialog>
  );
}
