import {
  capitalize,
  Card,
  CardActionArea,
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
import getStatusIcon from '../../utils/listItemUtil';
import { useThemeContext } from '../../providers/ThemeProvider';

function BookListItem({ title, detailText, status, score, itemId, onEditClick }) {
  const navigate = useNavigate();
  const { darkTheme } = useThemeContext();

  const navigateToDetail = () => navigate(`./${itemId}`);

  return (
    <ImageListItem sx={{ minWidth: 0 }}>
      <Card variant="outlined">
        <CardActionArea onClick={navigateToDetail}>
          <CardContent sx={{ px: 1.5, pt: 2, pb: 0 }}>
            <Grid container>
              <Grid minWidth={0} flex={'1 1 0px'}>
                <Typography noWrap variant="body1">
                  {stringOrPlaceholder(title)}
                </Typography>
                <Typography noWrap variant="body2">
                  {stringOrPlaceholder(detailText)}
                </Typography>
              </Grid>
              <Grid item alignSelf="end">
                <Typography variant="body2">
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
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            m: 1,
            p: 0,
          }}
        >
          <CardActionButton onClick={navigateToDetail}>Details</CardActionButton>
          <CardActionButton onClick={() => onEditClick(itemId)}>Edit</CardActionButton>
        </CardActions>
      </Card>
    </ImageListItem>
  );
}

export default BookListItem;
