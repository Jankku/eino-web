import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../../utils/stringUtil';

export function StatsItem({ title, text }) {
  return (
    <Grid item>
      <Grid container gap={1}>
        <Grid item>
          <Typography variant="body1">{stringOrPlaceholder(title)}</Typography>
        </Grid>
        <Grid item>
          <Typography paragraph variant="body1" margin={0} sx={{ fontWeight: 700 }}>
            {stringOrPlaceholder(text)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
