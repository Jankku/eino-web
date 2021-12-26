import {
  capitalize,
  Card,
  CardActions,
  CardContent,
  Grid,
  ImageListItem,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringutil';
import CardActionButton from './CardActionButton';

function BookListItem({
  title,
  detailText,
  status,
  score,
  itemId,
  setEditedItemId,
  handleEditDialogOpen,
}) {
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
                {stringOrPlaceholder(title)}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                noWrap
                sx={{
                  width: '10em',
                }}
              >
                {stringOrPlaceholder(detailText)}
              </Typography>
            </Grid>
            <Grid item wrap="nowrap">
              <Typography variant="body2" component="div">
                {score}
              </Typography>
              <Typography variant="body2" component="div">
                {capitalize(status)}
              </Typography>
            </Grid>
          </Grid>
          <CardActions
            sx={{
              m: '1em 0 0 0',
              p: 0,
            }}
          >
            <CardActionButton onClick={() => navigate(`./${itemId}`)}>
              Details
            </CardActionButton>
            <CardActionButton
              onClick={() => {
                handleEditDialogOpen();
                setEditedItemId(itemId);
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
