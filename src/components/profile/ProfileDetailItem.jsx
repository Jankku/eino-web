import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';

export function ProfileDetailItem({ title, text }) {
  return (
    <Grid item>
      <Grid item>
        <Typography component="dt" variant="body1" sx={{ fontWeight: 700 }}>
          {stringOrPlaceholder(title)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography component="dd" paragraph variant="body1">
          {stringOrPlaceholder(text)}
        </Typography>
      </Grid>
    </Grid>
  );
}
