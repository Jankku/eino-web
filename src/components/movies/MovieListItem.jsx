import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  ImageListItem,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringutil';
import CardActionButton from '../common/CardActionButton';

function MovieListItem({ movie, seteditedMovieId, handleEditDialogOpen }) {
  const navigate = useNavigate();

  return (
    <ImageListItem>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Grid item>
              <Typography
                variant="body1"
                component="div"
                noWrap
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '11em',
                  maxLines: 1,
                }}
              >
                {stringOrPlaceholder(movie.title)}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                noWrap
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '12em',
                  maxLines: 1,
                }}
              >
                {stringOrPlaceholder(movie.studio)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" component="div">
                {movie.score}
              </Typography>
              <Typography variant="body2" component="div">
                {capitalize(movie.status)}
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <CardActions
            sx={{
              m: '0.5em 0 0 0',
              p: 0,
            }}
          >
            <CardActionButton onClick={() => navigate(`./${movie.movie_id}`)}>
              Details
            </CardActionButton>
            <CardActionButton
              text="Edit"
              onClick={() => {
                handleEditDialogOpen();
                seteditedMovieId(movie.book_id);
              }}
            >
              Edit
            </CardActionButton>
          </CardActions>
        </CardContent>
      </Card>
    </ImageListItem>
  );
}

export default MovieListItem;
