import {
  capitalize,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useLocation, useNavigate } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import getStatusIcon from '../../utils/listItemUtil';

export default function ListItemImage({ title, detailText, status, score, itemId, imageUrl }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname.includes(itemId);

  const navigateToDetail = () => navigate(`./${itemId}${location.search}`);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        border: isActive ? `1px solid ${theme.palette.primary.dark}` : undefined,
      })}
    >
      <CardActionArea onClick={navigateToDetail}>
        <CardContent sx={{ padding: 0 }}>
          <Grid container item zeroMinWidth flexDirection="row" flexWrap="nowrap">
            <Grid container item>
              {imageUrl ? (
                <img
                  loading={'lazy'}
                  alt="Book cover"
                  referrerPolicy="no-referrer"
                  src={imageUrl}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover', aspectRatio: 0.7 }}
                />
              ) : null}
              <Grid
                px={2}
                pb={2}
                pt={6}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), 60%, rgba(0, 0, 0, 0))',
                }}
              >
                <Stack direction="row">
                  <Chip
                    icon={<StarIcon color="white" />}
                    size="small"
                    label={score}
                    sx={(theme) => ({
                      backgroundColor: 'transparent',
                      color: 'white',
                      padddingX: 0,
                      fontSize: theme.typography.caption.fontSize,
                      '& .MuiChip-icon,': {
                        marginX: 0,
                      },
                      '& .MuiChip-label': {
                        paddingX: '4px',
                      },
                    })}
                  />
                  <Chip
                    icon={getStatusIcon(status, 'white')}
                    size="small"
                    label={capitalize(status)}
                    sx={(theme) => ({
                      backgroundColor: 'transparent',
                      color: 'white',
                      fontSize: theme.typography.caption.fontSize,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      '& .MuiChip-icon,': {
                        marginX: 0,
                      },
                      '& .MuiChip-label': {
                        paddingX: '2px',
                      },
                    })}
                  />
                </Stack>
                <Grid container alignContent="flex-start" flex={'1 1 0px'}>
                  <Typography noWrap variant="body1" width="100%" fontWeight={500} color="white">
                    {stringOrPlaceholder(title)}
                  </Typography>
                  <Typography noWrap variant="body2" width="100%" color="#ddd">
                    {stringOrPlaceholder(detailText)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
