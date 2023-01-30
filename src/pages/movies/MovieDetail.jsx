import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router-dom';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import DetailItem from '../../components/common/DetailItem';
import { deleteMovie, getMovieDetails } from '../../data/Movie';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useReducer } from 'react';

export default function MovieDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { movieId } = useParams();
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useReducer((open) => !open, false);
  const { isLoading, isError, data } = useQuery(
    ['movie', movieId],
    () => getMovieDetails(movieId),
    {
      visible: movieId,
      onError: () => showErrorSnackbar('Failed to load movie'),
      initialData: () =>
        queryClient
          .getQueryData(['movies', 'all'], { exact: true })
          ?.find((m) => m.movie_id === movieId),
    }
  );
  const deleteMovieMutation = useMutation((movieId) => deleteMovie(movieId), {
    onSuccess: () => queryClient.invalidateQueries(['movies']),
  });

  return (
    <Container maxWidth="md">
      {isError ? (
        <Grid container justifyContent="center" pt={8}>
          <Typography variant={'h6'}>Couldn&apos;t find movie</Typography>
        </Grid>
      ) : isLoading ? (
        <Grid container justifyContent="center" pt={8}>
          <CircularProgress />
        </Grid>
      ) : data ? (
        <Card
          sx={{
            mt: 3,
            border: 1,
            borderColor: 'primary.main',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Grid container columns={3} justifyContent="flex-start">
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
          </CardContent>
          <CardActions sx={{ m: 0, pt: 0, pl: 2, pb: 3 }}>
            <Grid container justifyContent="flex-start">
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
                color="secondary"
                onClick={() =>
                  deleteMovieMutation.mutate(movieId, {
                    onSuccess: () => {
                      showSuccessSnackbar('Movie deleted.');
                      navigate(-1);
                    },
                    onError: () => {
                      showErrorSnackbar('Failed to delete movie.');
                    },
                  })
                }
                startIcon={<DeleteIcon />}
                sx={{ margin: '0.5em' }}
              >
                Delete
              </Button>
            </Grid>
          </CardActions>
        </Card>
      ) : null}

      <EditMovieDialog visible={editDialogOpen} closeDialog={toggleEditDialog} movieId={movieId} />
    </Container>
  );
}
