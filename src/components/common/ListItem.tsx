import type { ItemNavigationState } from '../../hooks/useRestoreItemFocus';
import {
  Box,
  capitalize,
  Card,
  CardActionArea,
  CardContent,
  Chip,
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
  to?: string;
  lighten?: boolean;
  navigationState?: ItemNavigationState;
};

export default function ListItem({
  title,
  detailText,
  status,
  score,
  itemId,
  imageUrl,
  to,
  lighten,
  navigationState,
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
      <CardActionArea component="div" tabIndex={-1} role={undefined}>
        <CardContent sx={{ pr: 1, py: 0, pl: 0 }}>
          <Stack direction="row" sx={{ width: '100%', minWidth: 0, flexWrap: 'nowrap' }}>
            <Box
              sx={(theme) => ({
                position: 'relative',
                display: 'flex',
                flexWrap: 'wrap',
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
                  style={{ position: 'absolute', inset: 0, objectFit: 'cover' }}
                />
              ) : null}
            </Box>
            <Stack
              direction="column"
              sx={{ flexWrap: 'wrap', width: '100%', minWidth: 0, ml: 1, mt: 1 }}
            >
              <Stack
                direction="column"
                sx={{
                  flexWrap: 'wrap',
                  width: '100%',
                  alignContent: 'flex-start',
                  flex: '1 1 0px',
                }}
              >
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
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        <Box
          component={Link}
          draggable={false}
          id={itemId}
          to={to ?? `./${itemId}${location.search}`}
          state={navigationState}
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
