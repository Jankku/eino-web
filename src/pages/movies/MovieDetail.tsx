import { Button, capitalize } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { DateTime } from 'luxon';
import { useNavigate, useParams } from 'react-router';
import EditMovieDialog from '../../components/movies/EditMovieDialog';
import DetailItem from '../../components/common/DetailItem';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useMovieDetail } from '../../data/movies/useMovieDetail';
import { useDeleteMovie } from '../../data/movies/useDeleteMovie';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteButton from '../../components/common/DeleteButton';
import BaseDetailLayout from '../../components/layout/BaseDetailLayout';
import { useToggle } from '@uidotdev/usehooks';

export default function MovieDetail() {
  const navigate = useNavigate();
  const movieId = useParams().movieId!;
  const { showSuccessSnackbar, showErrorSnackbar } = useCustomSnackbar();
  const [editDialogOpen, toggleEditDialog] = useToggle(false);
  const { data } = useMovieDetail(movieId);
  const deleteMovie = useDeleteMovie();

  const copyToClipboard = async () => {
    try {
      const contents = data.director ? `${data.director} - ${data.title}` : data.title;
      await navigator.clipboard.writeText(contents);
      showSuccessSnackbar('Copied');
    } catch {
      showErrorSnackbar('Failed to copy');
    }
  };

  return (
    <BaseDetailLayout
      backButtonDefaultUrl="/movies"
      imageUrl={data.image_url}
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
          <Button
            variant="contained"
            color="primary"
            onClick={toggleEditDialog as () => void}
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
            loading={deleteMovie.isPending}
            variant="contained"
            color="secondary"
            sx={{ margin: '0.5em' }}
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
    </BaseDetailLayout>
  );
}
