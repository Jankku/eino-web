import { Typography, Box, Stack } from '@mui/material';
import { stringOrPlaceholder } from '../../../utils/stringUtil';

type StatsItemProps = {
  title: string;
  text: string | number;
};

export function StatsItem({ title, text }: StatsItemProps) {
  return (
    <Box>
      <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%', gap: 1 }}>
        <Typography component="dt" variant="body1">
          {stringOrPlaceholder(title)}
        </Typography>
        <Typography component="dd" variant="body1" sx={{ fontWeight: 700 }}>
          {stringOrPlaceholder(text)}
        </Typography>
      </Stack>
    </Box>
  );
}
