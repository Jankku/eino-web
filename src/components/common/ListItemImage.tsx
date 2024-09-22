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
import { Link, useLocation } from 'react-router-dom';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import getStatusIcon from '../../utils/listItemUtil';

type ListItemImageProps = {
  title: string;
  detailText: string;
  status: string;
  score: number;
  itemId: string;
  imageUrl: string | null;
};

export default function ListItemImage({
  title,
  detailText,
  status,
  score,
  itemId,
  imageUrl,
}: ListItemImageProps) {
  const location = useLocation();
  const isActive = location.pathname.includes(itemId);

  return (
    <Card
      component="li"
      variant="outlined"
      sx={(theme) => ({
        border: isActive ? `1px solid ${theme.palette.primary.dark}` : undefined,
        aspectRatio: 0.7,
      })}
    >
      <CardActionArea
        component={Link}
        to={`./${itemId}${location.search}`}
        style={{ width: '100%', height: '100%' }}
        draggable="false"
      >
        <CardContent sx={{ padding: 0 }}>
          <Grid container item zeroMinWidth flexDirection="row" flexWrap="nowrap" height="100%">
            <Grid container item>
              {imageUrl ? (
                <img
                  draggable="false"
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
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), 75%, rgba(0, 0, 0, 0))',
                }}
              >
                <Stack direction="row">
                  <Chip
                    icon={<StarIcon color="inherit" />}
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
                  <Typography
                    noWrap
                    variant="body1"
                    width="100%"
                    fontWeight={500}
                    sx={{ color: 'white' }}
                  >
                    {stringOrPlaceholder(title)}
                  </Typography>
                  <Typography noWrap variant="body2" width="100%" sx={{ color: '#ddd' }}>
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
