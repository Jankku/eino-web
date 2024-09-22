import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../../utils/stringUtil';

type StatsItemProps = {
  title: string;
  text: string | number;
};

export function StatsItem({ title, text }: StatsItemProps) {
  return (
    <Grid item>
      <Grid
        container
        sx={{
          gap: 1,
        }}
      >
        <Typography component="dt" variant="body1">
          {stringOrPlaceholder(title)}
        </Typography>
        <Typography component="dd" variant="body1" sx={{ fontWeight: 700 }}>
          {stringOrPlaceholder(text)}
        </Typography>
      </Grid>
    </Grid>
  );
}
