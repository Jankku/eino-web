import { Grid, Typography } from '@mui/material';
import { stringOrPlaceholder } from '../../utils/stringUtil';

type ProfileDetailItemProps = {
  title: string;
  text: string | null;
};

export function ProfileDetailItem({ title, text }: ProfileDetailItemProps) {
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
