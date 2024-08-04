import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';

type DetailItemProps = {
  title: string;
  text: string | number;
};

export default function DetailItem({ title, text }: DetailItemProps) {
  return (
    <Grid container item flexWrap="nowrap" my={1}>
      <Typography
        component="dt"
        variant="body1"
        noWrap
        alignSelf="center"
        sx={{ fontWeight: 700, minWidth: '5em' }}
      >
        {stringOrPlaceholder(title)}
      </Typography>
      <Typography component="dd" variant="body2" noWrap minWidth={0} ml={2} alignSelf="center">
        {stringOrPlaceholder(text)}
      </Typography>
    </Grid>
  );
}
