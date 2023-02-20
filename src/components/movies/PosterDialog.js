import { CircularProgress, Grid, ImageList, ImageListItem, Link, Typography } from '@mui/material';
import { useMoviePosters } from '../../data/movies/useMoviePosters';
import useIsMobile from '../../hooks/useIsMobile';
import ImageDialog from '../common/ImageDialog';

export default function PosterDialog({ visible, closeDialog, query, onSelect }) {
  const isMobile = useIsMobile();
  const moviePosters = useMoviePosters(visible, query);

  return (
    <ImageDialog
      title="Find movie poster"
      sources={
        <Link href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          TMDB
        </Link>
      }
      visible={visible}
      closeDialog={closeDialog}
    >
      {moviePosters.isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : null}
      {moviePosters.isLoadingError ? <Typography pt={2}>Failed to load posters.</Typography> : null}
      {moviePosters.data?.length > 0 ? (
        <ImageList
          cols={3}
          gap={2}
          sx={{
            height: isMobile ? '100%' : 450,
          }}
        >
          {moviePosters.data?.map((posterUrl) => (
            <ImageListItem
              key={posterUrl}
              sx={{
                aspectRatio: 0.7,
                justifySelf: 'center',
                width: '100%',
                height: '150px',
              }}
            >
              <img
                loading="lazy"
                alt="Movie poster"
                referrerPolicy="no-referrer"
                src={posterUrl}
                width="100%"
                height="100%"
                style={{ objectFit: 'cover' }}
                onClick={() => onSelect(posterUrl)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography pt={2}>No posters found.</Typography>
      )}
    </ImageDialog>
  );
}
