import { CircularProgress, ImageList, ImageListItem, Link, Typography, Stack } from '@mui/material';
import { useMoviePosters } from '../../data/movies/useMoviePosters';
import ImageDialog from '../common/ImageDialog';

type PosterDialogProps = {
  visible: boolean;
  query: string;
  closeDialog: () => void;
  onSelect: (posterUrl: string) => void;
};

export default function PosterDialog({ visible, query, closeDialog, onSelect }: PosterDialogProps) {
  const moviePosters = useMoviePosters(visible, query);

  return (
    <ImageDialog
      title="Find movie poster"
      sources={
        <>
          <Link href="https://finna.fi/" rel="noreferrer">
            Finna
          </Link>
          ,{' '}
          <Link href="https://www.themoviedb.org/" rel="noreferrer">
            TMDB
          </Link>
        </>
      }
      visible={visible}
      closeDialog={closeDialog}
    >
      {moviePosters.isLoading ? (
        <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : null}
      {moviePosters.isLoadingError ? (
        <Typography sx={{ pt: 2 }}>Failed to load posters.</Typography>
      ) : null}
      {moviePosters.isSuccess && moviePosters.data?.length > 0 ? (
        <ImageList cols={3} rowHeight={250}>
          {moviePosters.data?.map((posterUrl) => (
            <ImageListItem
              key={posterUrl}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                minWidth: 0,
                width: '100%',
              }}
            >
              <img
                draggable="false"
                tabIndex={0}
                loading="lazy"
                alt="Movie poster"
                referrerPolicy="no-referrer"
                src={posterUrl}
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
                onClick={() => onSelect(posterUrl)}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') onSelect(posterUrl);
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : null}
      {moviePosters.isSuccess && moviePosters.data?.length === 0 ? (
        <Typography sx={{ pt: 2 }}>No posters found.</Typography>
      ) : null}
    </ImageDialog>
  );
}
