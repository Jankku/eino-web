import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';

export default function DetailItem({ title, text }) {
  return (
    <Grid container item zeroMinWidth flexWrap="nowrap" my={0.5}>
      <Typography
        variant="body1"
        noWrap
        alignSelf="center"
        sx={{ fontWeight: 700, minWidth: '5em' }}
      >
        {stringOrPlaceholder(title)}
      </Typography>
      <Grid container item zeroMinWidth flexWrap="nowrap">
        <Typography variant="body2" noWrap minWidth={0} ml={2} alignSelf="center">
          {stringOrPlaceholder(text)}
        </Typography>
      </Grid>
    </Grid>
  );
}
