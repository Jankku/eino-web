import { Button, capitalize } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router';
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

export default function MovieDetail() {
  const navigate = useNavigate();
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

  return (
    <BaseDetailLayout
      backButtonDefaultUrl="/movies"
      imageUrl={data.image_url}
      copyText="Copy title and director"
      onCopy={copyToClipboard}
      details={
        <>
          <DetailItem title="Title" text={data.title} />
          <DetailItem title="Studio" text={data.studio} />
          <DetailItem title="Director" text={data.director} />
          <DetailItem title="Writer" text={data.writer} />
          <DetailItem title="Duration" text={`${data.duration} minutes`} />
          <DetailItem title="Released" text={data.year} />
          <DetailItem title="Status" text={capitalize(String(data.status))} />
          <DetailItem title="Score" text={data.score} />
          <DetailItem
            title="Start date"
            text={DateTime.fromISO(data.start_date).toLocaleString()}
          />
          <DetailItem title="End date" text={DateTime.fromISO(data.end_date).toLocaleString()} />
          <DetailItem multiline title="Note" text={data.note} />
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
            onClick={() => {
              deleteMovie.mutate(movieId, {
                onSuccess: () => {
                  showSuccessSnackbar('Movie deleted');
                  navigate(-1);
                },
                onError: () => {
                  showErrorSnackbar('Failed to delete movie');
                },
              });
            }}
          />
        </>
      }
    >
      <EditMovieDialog visible={editDialogOpen} closeDialog={toggleEditDialog} movieId={movieId} />

      <CompleteDialog
        visible={completeDialogOpen}
        closeDialog={toggleCompleteDialog}
        onComplete={onComplete}
      />
    </BaseDetailLayout>
  );
}
