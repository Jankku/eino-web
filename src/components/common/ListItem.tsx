import {
  Box,
  capitalize,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  GridLegacy,
  Stack,
  Typography,
  useColorScheme,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link, useLocation } from 'react-router';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import { getStatusIcon } from '../../utils/listItemUtil';
import SrOnly from './SrOnly';

type ListItemProps = {
  title: string;
  detailText: string;
  status: string;
  score: number;
  itemId: string;
  imageUrl: string | null;
  disableClick?: boolean;
  lighten?: boolean;
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>;
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
  onNavigate,
}: ListItemProps) {
  const location = useLocation();
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  const isActive = location.pathname.includes(itemId);

  return (
    <Card
      component="li"
      variant={lighten ? 'elevation' : 'outlined'}
      sx={(theme) => ({
        position: 'relative',
        outline: isActive ? `2px solid ${theme.palette.primary.dark}` : undefined,
        outlineOffset: '-2px',
      })}
    >
      <CardActionArea disabled={disableClick} component="div" tabIndex={-1} role={undefined}>
        <CardContent sx={{ pr: 1, py: 0, pl: 0 }}>
          <GridLegacy container item zeroMinWidth sx={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
            <GridLegacy
              container
              sx={(theme) => ({
                width: '10em',
                minHeight: '10em',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                ...theme.applyStyles('dark', {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }),
              })}
            >
              {imageUrl ? (
                <img
                  draggable="false"
                  loading={'lazy'}
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  src={imageUrl}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              ) : null}
            </GridLegacy>
            <GridLegacy container item zeroMinWidth sx={{ flexDirection: 'column', ml: 1, mt: 1 }}>
              <GridLegacy container sx={{ alignContent: 'flex-start', flex: '1 1 0px' }}>
                <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                  <Chip
                    icon={<StarIcon />}
                    variant={isDark ? 'outlined' : 'filled'}
                    color={isDark ? 'default' : 'primary'}
                    size="small"
                    label={score}
                    sx={{ border: 'none' }}
                  />
                  <Chip
                    icon={getStatusIcon(status)}
                    variant={isDark ? 'outlined' : 'filled'}
                    size="small"
                    label={capitalize(status)}
                    sx={{ border: 'none' }}
                  />
                </Stack>
                <Typography noWrap variant="body1" sx={{ width: '100%', fontWeight: 500 }}>
                  {stringOrPlaceholder(title)}
                </Typography>
                <Typography noWrap variant="body2" sx={{ width: '100%', color: 'text.secondary' }}>
                  {stringOrPlaceholder(detailText)}
                </Typography>
              </GridLegacy>
            </GridLegacy>
          </GridLegacy>
        </CardContent>
        <Box
          component={Link}
          draggable={false}
          id={itemId}
          to={`./${itemId}${location.search}`}
          onClick={onNavigate}
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '-2px',
            },
          })}
        >
          <SrOnly>
            {title}, {detailText}
          </SrOnly>
        </Box>
      </CardActionArea>
    </Card>
  );
}
