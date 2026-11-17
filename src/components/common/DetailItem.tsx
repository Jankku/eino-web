import { Typography, Stack } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';
import TruncatedText from './TruncatedText';

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
      <TruncatedText
        component="dd"
        variant="body2"
        multiline={multiline}
        sx={{
          minWidth: 0,
          alignSelf: 'center',
        }}
      >
        {stringOrPlaceholder(value)}
      </TruncatedText>
    </Stack>
  );
}
