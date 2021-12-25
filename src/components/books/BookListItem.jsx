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

function BookListItem({ book, seteditedBookId, handleEditDialogOpen }) {
  const navigate = useNavigate();

  return (
    <ImageListItem>
      <Card variant="outlined">
        <CardContent>
          <Grid
            container
            wrap="nowrap"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Grid item wrap="nowrap">
              <Typography
                variant="body1"
                component="div"
                noWrap
                sx={{
                  width: '10em',
                }}
              >
                {stringOrPlaceholder(book.title)}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                noWrap
                sx={{
                  width: '10em',
                }}
              >
                {stringOrPlaceholder(book.author)}
              </Typography>
            </Grid>
            <Grid item wrap="nowrap">
              <Typography variant="body2" component="div">
                {book.score}
              </Typography>
              <Typography variant="body2" component="div">
                {capitalize(book.status)}
              </Typography>
            </Grid>
          </Grid>
          <CardActions
            sx={{
              m: '1em 0 0 0',
              p: 0,
            }}
          >
            <CardActionButton onClick={() => navigate(`./${book.book_id}`)}>
              Details
            </CardActionButton>
            <CardActionButton
              onClick={() => {
                handleEditDialogOpen();
                seteditedBookId(book.book_id);
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

export default BookListItem;
