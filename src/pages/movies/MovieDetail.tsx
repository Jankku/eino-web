import { Box, Button, capitalize, Stack } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import DetailItem from '../../components/common/DetailItem';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useMovieDetail } from '../../data/movies/useMovieDetail';
import { useDeleteMovie } from '../../data/movies/useDeleteMovie';
import DeleteButton from '../../components/common/DeleteButton';
import BaseDetailLayout from '../../components/layout/BaseDetailLayout';
import { useToggle } from '@uidotdev/usehooks';
import { useUpdateMovie } from '../../data/movies/useUpdateMovie';
import { movieSchema } from '../../models/movie';
import DoneIcon from '@mui/icons-material/Done';
import CompleteDialog from '../../components/common/CompleteDialog';
import ScoreChip from '../../components/common/ScoreChip';
import StatusChip from '../../components/common/StatusChip';

const numberFormatter = new Intl.NumberFormat();

export default function MovieDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = useParams().movieId!;
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useToggle(false);
  const [completeDialogOpen, toggleCompleteDialog] = useToggle(false);
  const { data } = useMovieDetail(movieId);
  const updateMovie = useUpdateMovie(movieId);
  const deleteMovie = useDeleteMovie();

  const isCompleted = data.status === 'completed';

  const copyToClipboard = async () => {
    try {
      const contents = data.director ? `${data.director} - ${data.title}` : data.title;
      await navigator.clipboard.writeText(contents);
      showSuccessSnackbar('Title and director copied to clipboard');
    } catch {
      showErrorSnackbar('Failed to copy');
    }
  };

  const onComplete = (score: number) => {
    updateMovie.mutate(
      movieSchema.parse({ ...data, score, status: 'completed', end_date: DateTime.now().toISO() }),
      {
        onSuccess: () => {
          showSuccessSnackbar('Movie marked as completed');
        },
        onError: () => {
          showErrorSnackbar('Failed to mark movie as completed');
        },
      },
    );
  };

  const onDelete = () => {
    deleteMovie.mutate(movieId, {
      onSuccess: () => {
        showSuccessSnackbar('Movie deleted');
        navigate({ pathname: '/movies', search: searchParams.toString() });
      },
      onError: () => {
        showErrorSnackbar('Failed to delete movie');
      },
    });
  };

  return (
    <BaseDetailLayout
      imageUrl={data.image_url}
      copyText="Copy title and director"
      onCopy={copyToClipboard}
      details={
        <>
          <Stack direction="row" mb={0.5}>
            <ScoreChip score={data.score} />
            <StatusChip
              status={data.status}
              chipText={
                data.status === 'completed' && data.end_date
                  ? `${capitalize(data.status)} ${DateTime.fromISO(data.end_date).toRelative()}`
                  : capitalize(data.status)
              }
              tooltipText={`Watched: ${
                data.start_date === data.end_date
                  ? DateTime.fromISO(data.start_date).toLocaleString()
                  : `${DateTime.fromISO(data.start_date).toLocaleString()}–${DateTime.fromISO(data.end_date).toLocaleString()}`
              }`}
            />
          </Stack>
          <Stack mb={2}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
              {data.title}
            </Box>
            <Box component="span">{[data.director, data.year].filter(Boolean).join(', ')}</Box>
          </Stack>
          <Box component="dl">
            {data.writer ? <DetailItem title="Writer" value={data.writer} /> : undefined}
            {data.studio ? <DetailItem title="Studio" value={data.studio} /> : undefined}
            {data.duration ? (
              <DetailItem
                title="Duration"
                value={`${numberFormatter.format(data.duration)} minutes`}
              />
            ) : undefined}
            {data.note ? <DetailItem multiline title="Note" value={data.note} /> : undefined}
          </Box>
        </>
      }
      actions={
        <>
          {!isCompleted ? (
            <Button
              variant="contained"
              color="success"
              onClick={toggleCompleteDialog as () => void}
              startIcon={<DoneIcon />}
            >
              Complete
            </Button>
          ) : undefined}
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditDialog as () => void}
            startIcon={<CreateIcon />}
          >
            Edit
          </Button>
          <DeleteButton
            loading={deleteMovie.isPending}
            variant="outlined"
            color="secondary"
            onClick={onDelete}
          />
        </>
      }
    >
      {editDialogOpen ? (
        <EditMovieDialog
          visible={editDialogOpen}
          closeDialog={toggleEditDialog}
          movieId={movieId}
        />
      ) : undefined}

      {completeDialogOpen ? (
        <CompleteDialog
          visible={completeDialogOpen}
          closeDialog={toggleCompleteDialog}
          onComplete={onComplete}
        />
      ) : undefined}
    </BaseDetailLayout>
  );
}
