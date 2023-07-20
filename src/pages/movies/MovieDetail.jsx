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
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import DetailItem from '../../components/common/DetailItem';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useReducer } from 'react';
import { useMovieDetail } from '../../data/movies/useMovieDetail';
import { useDeleteMovie } from '../../data/movies/useDeleteMovie';
import useIsMobile from '../../hooks/useIsMobile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteButton from '../../components/common/DeleteButton';

export default function MovieDetail() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { data } = useMovieDetail(movieId);
  const deleteMovie = useDeleteMovie();
  const hasImage = !!data.image_url;

  const copyToClipboard = async () => {
    try {
      const contents = data.director ? `${data.director} - ${data.title}` : data.title;
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
                  alt="Movie poster"
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
              <DetailItem title="Studio" text={data.studio} />
              <DetailItem title="Director" text={data.director} />
              <DetailItem title="Writer" text={data.writer} />
              <DetailItem title="Duration" text={`${data.duration} minutes`} />
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
              loading={deleteMovie.isLoading}
              variant="contained"
              color="secondary"
              sx={{ margin: '0.5em' }}
              onClick={() => {
                deleteMovie.mutate(movieId, {
                  onSuccess: () => {
                    showSuccessSnackbar('Movie deleted.');
                    navigate(-1);
                  },
                  onError: () => {
                    showErrorSnackbar('Failed to delete movie.');
                  },
                });
              }}
            />
          </Grid>
        </CardActions>
      </Card>

      <EditMovieDialog visible={editDialogOpen} closeDialog={toggleEditDialog} movieId={movieId} />
    </Container>
  );
}
