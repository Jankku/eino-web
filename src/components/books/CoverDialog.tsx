import {
  CircularProgress,
  GridLegacy,
  ImageList,
  ImageListItem,
  Link,
  Typography,
} from '@mui/material';
import { useBookCovers } from '../../data/books/useBookCovers';
import ImageDialog from '../common/ImageDialog';

type CoverDialogProps = {
  visible: boolean;
  query: string;
  closeDialog: () => void;
  onSelect: (coverUrl: string) => void;
};

export default function CoverDialog({ visible, query, closeDialog, onSelect }: CoverDialogProps) {
  const bookCovers = useBookCovers(visible, query);

  return (
    <ImageDialog
      title="Find book cover"
      sources={
        <>
          <Link href="https://finna.fi/" rel="noreferrer">
            Finna
          </Link>
          ,{' '}
          <Link href="https://openlibrary.org/" rel="noreferrer">
            Open Library
          </Link>
        </>
      }
      visible={visible}
      closeDialog={closeDialog}
    >
      {bookCovers.isLoading ? (
        <GridLegacy container sx={{ justifyContent: 'center' }}>
          <CircularProgress />
        </GridLegacy>
      ) : null}
      {bookCovers.isLoadingError ? (
        <Typography sx={{ pt: 2 }}>Failed to load covers.</Typography>
      ) : null}
      {bookCovers.isSuccess && bookCovers.data?.length > 0 ? (
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
                draggable="false"
                tabIndex={0}
                loading="lazy"
                alt="Book cover"
                referrerPolicy="no-referrer"
                src={coverUrl}
                style={{ objectFit: 'contain', aspectRatio: 0.7 }}
                onClick={() => onSelect(coverUrl)}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') onSelect(coverUrl);
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : null}
      {bookCovers.isSuccess && bookCovers.data?.length === 0 ? (
        <Typography sx={{ pt: 2 }}>No covers found.</Typography>
      ) : null}
    </ImageDialog>
  );
}
