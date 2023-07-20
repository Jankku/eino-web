import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditBookDialog from '../../components/books/EditBookDialog';
import DetailItem from '../../components/common/DetailItem';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useReducer } from 'react';
import { useBookDetail } from '../../data/books/useBookDetail';
import { useDeleteBook } from '../../data/books/useDeleteBook';
import useIsMobile from '../../hooks/useIsMobile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteButton from '../../components/common/DeleteButton';

export default function BookDetail() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { data } = useBookDetail(bookId);
  const deleteBook = useDeleteBook();
  const hasImage = !!data.image_url;

  const copyToClipboard = async () => {
    try {
      const contents = data.author ? `${data.author} - ${data.title}` : data.title;
      await navigator.clipboard.writeText(contents);
      showSuccessSnackbar('Copied');
    } catch (error) {
      showErrorSnackbar('Failed to copy');
    }
  };

  return (
    <Container fixed disableGutters={!isMobile} maxWidth="sm">
      <Card
        sx={{
          my: 3,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ pb: 0 }}>
          {isMobile ? (
            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute' }}>
              <ArrowBackIcon />
            </IconButton>
          ) : null}
          <Grid container justifyContent="center" flexWrap="wrap">
            {hasImage ? (
              <Grid
                container
                item
                zeroMinWidth
                flexShrink={2}
                mb={{ xs: 1, md: 0 }}
                sx={(theme) => ({
                  maxWidth: isMobile ? '50%' : '40%',
                  aspectRatio: 0.7,
                  borderRadius: 1,
                  boxShadow: theme.palette.mode === 'light' && theme.shadows[4],
                })}
              >
                <img
                  draggable="false"
                  alt="Book cover"
                  referrerPolicy="no-referrer"
                  src={data.image_url}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 'inherit',
                    objectFit: 'cover',
                    aspectRatio: 0.7,
                  }}
                />
              </Grid>
            ) : null}

            <Grid
              container
              item
              zeroMinWidth
              alignSelf="start"
              pl={2}
              pt={hasImage ? 1 : isMobile ? 6 : 1}
              columns={1}
            >
              <DetailItem title="Title" text={data.title} />
              <DetailItem title="Author" text={data.author} />
              <DetailItem title="Publisher" text={data.publisher} />
              <DetailItem title="ISBN" text={data.isbn} />
              <DetailItem title="Pages" text={data.pages} />
              <DetailItem title="Year" text={data.year} />
              <DetailItem title="Status" text={capitalize(String(data.status))} />
              <DetailItem title="Score" text={data.score} />
              <DetailItem
                title="Start date"
                text={DateTime.fromISO(data.start_date).toLocaleString()}
              />
              <DetailItem
                title="End date"
                text={DateTime.fromISO(data.end_date).toLocaleString()}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ m: 0, pt: 2, pl: 2, pb: 2 }}>
          <Grid container>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleEditDialog}
              startIcon={<CreateIcon />}
              sx={{ margin: '0.5em' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={copyToClipboard}
              startIcon={<ContentCopyIcon />}
              sx={{ margin: '0.5em' }}
            >
              Copy
            </Button>
            <DeleteButton
              loading={deleteBook.isLoading}
              variant="contained"
              color="secondary"
              sx={{ margin: '0.5em' }}
              onClick={() => {
                deleteBook.mutate(bookId, {
                  onSuccess: () => {
                    showSuccessSnackbar('Book deleted.');
                    navigate(-1);
                  },
                  onError: () => {
                    showErrorSnackbar('Failed to delete book.');
                  },
                });
              }}
            />
          </Grid>
        </CardActions>
      </Card>

      <EditBookDialog visible={editDialogOpen} closeDialog={toggleEditDialog} bookId={bookId} />
    </Container>
  );
}
