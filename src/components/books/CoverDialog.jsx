import { CircularProgress, Grid, ImageList, ImageListItem, Link, Typography } from '@mui/material';
import { useBookCovers } from '../../data/books/useBookCovers';
import ImageDialog from '../common/ImageDialog';

export default function CoverDialog({ visible, closeDialog, query, onSelect }) {
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
        <ImageList cols={3}>
          {bookCovers.data?.map((coverUrl) => (
            <ImageListItem
              key={coverUrl}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                minWidth: 120,
                width: '100%',
                height: 250,
              }}
            >
              <img
                loading="lazy"
                alt="Book cover"
                referrerPolicy="no-referrer"
                src={coverUrl}
                style={{ objectFit: 'contain', aspectRatio: 0.7 }}
                onClick={() => onSelect(coverUrl)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : null}
    </ImageDialog>
  );
}
