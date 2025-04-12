import {
  Box,
  capitalize,
  Card,
  CardActionArea,
  Chip,
  GridLegacy,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link, useLocation } from 'react-router';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import { getStatusIcon } from '../../utils/listItemUtil';
import SrOnly from './SrOnly';

type ListItemImageProps = {
  title: string;
  detailText: string;
  status: string;
  score: number;
  itemId: string;
  imageUrl: string | null;
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function ListItemImage({
  title,
  detailText,
  status,
  score,
  itemId,
  imageUrl,
  onNavigate,
}: ListItemImageProps) {
  const location = useLocation();
  const isActive = location.pathname.includes(itemId);

  return (
    <Card
      component="li"
      variant="outlined"
      sx={(theme) => ({
        position: 'relative',
        outline: isActive ? `2px solid ${theme.palette.primary.dark}` : undefined,
        outlineOffset: '-2px',
        aspectRatio: 0.7,
      })}
    >
      <CardActionArea component="div" tabIndex={-1} role={undefined} sx={{ height: '100%' }}>
        {imageUrl ? (
          <img
            draggable="false"
            loading={'lazy'}
            aria-hidden="true"
            referrerPolicy="no-referrer"
            src={imageUrl}
            width="100%"
            height="100%"
            style={{ objectFit: 'cover', aspectRatio: 0.7 }}
          />
        ) : null}
        <GridLegacy
          sx={{
            px: 2,
            pb: 2,
            pt: 6,
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
          <GridLegacy container>
            <Typography
              noWrap
              variant="body1"
              sx={{ width: '100%', fontWeight: 500, color: 'white' }}
            >
              {stringOrPlaceholder(title)}
            </Typography>
            <Typography noWrap variant="body2" sx={{ width: '100%', color: '#ddd' }}>
              {stringOrPlaceholder(detailText)}
            </Typography>
          </GridLegacy>
        </GridLegacy>
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
