import { Typography, Stack } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';

type DetailItemProps = {
  title: string;
  value: string | number | null | undefined;
  multiline?: boolean;
};

export default function DetailItem({ title, value, multiline }: DetailItemProps) {
  return (
    <Stack direction="row" sx={{ width: '100%', flexWrap: 'nowrap' }}>
      <Typography component="dt" variant="body1" sx={{ fontWeight: 500, minWidth: '6rem' }}>
        {stringOrPlaceholder(title)}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        noWrap={!multiline}
        sx={{
          minWidth: 0,
          alignSelf: 'center',
        }}
      >
        {stringOrPlaceholder(value)}
      </Typography>
    </Stack>
  );
}
