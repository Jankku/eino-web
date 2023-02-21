import {
  capitalize,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import CardActionButton from './CardActionButton';
import getStatusIcon from '../../utils/listItemUtil';
import { useThemeContext } from '../../providers/ThemeProvider';

function BookListItem({ title, detailText, status, score, itemId, imageUrl, onEditClick }) {
  const navigate = useNavigate();
  const { darkTheme } = useThemeContext();

  const navigateToDetail = () => navigate(`./${itemId}`);

  return (
    <Card variant="outlined">
      <CardActionArea onClick={navigateToDetail}>
        <CardContent sx={{ px: 1.5, pt: 2, pb: 0 }}>
          <Grid container item zeroMinWidth flexDirection="row" flexWrap="nowrap">
            <Grid
              container
              width="10em"
              height="10em"
              sx={{
                backgroundColor: darkTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {imageUrl ? (
                <img
                  loading={'lazy'}
                  alt="Book cover"
                  referrerPolicy="no-referrer"
                  src={imageUrl}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover', borderRadius: 4, aspectRatio: 0.7 }}
                />
              ) : null}
            </Grid>
            <Grid container item zeroMinWidth flexDirection="column" ml={1}>
              <Grid container flexDirection="column" alignContent="flex-start" flex={'1 1 0px'}>
                <Stack direction="row" spacing={0.5} mb={1}>
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
                <Typography noWrap variant="body1" width="100%" fontWeight={500}>
                  {stringOrPlaceholder(title)}
                </Typography>
                <Typography noWrap variant="body2" width="100%" color="text.secondary">
                  {stringOrPlaceholder(detailText)}
                </Typography>
              </Grid>
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
        <Grid container justifyContent="flex-end" columnGap={1}>
          <CardActionButton onClick={navigateToDetail}>Details</CardActionButton>
          <CardActionButton onClick={() => onEditClick(itemId)}>Edit</CardActionButton>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default BookListItem;
