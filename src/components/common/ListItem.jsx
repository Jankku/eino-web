import {
  capitalize,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  ImageListItem,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import CardActionButton from './CardActionButton';
import getStatusIcon from '../../utils/statusIcon';
import { useThemeContext } from '../../themes/theme';

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
  const { darkTheme } = useThemeContext();

  return (
    <ImageListItem>
      <Card variant="outlined">
        <CardContent sx={{ px: 1.5, py: 2 }}>
          <Grid container justifyContent="space-between">
            <Grid item>
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
            <Grid item alignSelf="end">
              <Typography variant="body2" component="div">
                <Stack spacing={0.5}>
                  <Chip
                    icon={<StarIcon />}
                    variant={darkTheme === 'dark' ? 'outlined' : 'filled'}
                    color={darkTheme === 'dark' ? 'default' : 'primary'}
                    size="small"
                    label={score}
                  />
                  <Chip
                    icon={getStatusIcon(status)}
                    variant={darkTheme === 'dark' ? 'outlined' : 'filled'}
                    size="small"
                    label={capitalize(status)}
                  />
                </Stack>
              </Typography>
            </Grid>
          </Grid>
          <CardActions
            sx={{
              m: '0.5em 0 0 0',
              p: 0,
            }}
          >
            <CardActionButton onClick={() => navigate(`./${itemId}`)}>Details</CardActionButton>
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
