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
import { useThemeContext } from '../../providers/ThemeProvider';

type ListItemProps = {
  title: string;
  detailText: string;
  status: string;
  score: number;
  itemId: string;
  imageUrl: string | null;
  disableClick?: boolean;
  lighten?: boolean;
};

export default function ListItem({
  title,
  detailText,
  status,
  score,
  itemId,
  imageUrl,
  disableClick,
  lighten,
}: ListItemProps) {
  const location = useLocation();
  const { isDark } = useThemeContext();
  const isActive = location.pathname.includes(itemId);

  return (
    <Card
      component="li"
      variant={lighten ? 'elevation' : 'outlined'}
      sx={(theme) => ({
        border: isActive ? `1px solid ${theme.palette.primary.dark}` : undefined,
      })}
    >
      <CardActionArea
        component={Link}
        disabled={disableClick}
        to={`./${itemId}${location.search}`}
        sx={{ display: 'block' }}
        draggable="false"
      >
        <CardContent sx={{ pr: 1, py: 0, pl: 0 }}>
          <Grid container item zeroMinWidth flexDirection="row" flexWrap="nowrap">
            <Grid
              container
              width="10em"
              minHeight="10em"
              sx={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {imageUrl ? (
                <img
                  draggable="false"
                  loading={'lazy'}
                  alt="Book cover"
                  referrerPolicy="no-referrer"
                  src={imageUrl}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              ) : null}
            </Grid>
            <Grid container item zeroMinWidth flexDirection="column" ml={1} mt={1}>
              <Grid container alignContent="flex-start" flex={'1 1 0px'}>
                <Stack direction="row" spacing={0.5} mb={1}>
                  <Chip
                    icon={<StarIcon />}
                    variant={isDark ? 'outlined' : 'filled'}
                    color={isDark ? 'default' : 'primary'}
                    size="small"
                    label={score}
                  />
                  <Chip
                    icon={getStatusIcon(status)}
                    variant={isDark ? 'outlined' : 'filled'}
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
    </Card>
  );
}
