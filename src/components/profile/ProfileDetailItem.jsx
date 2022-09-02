import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { stringOrPlaceholder } from '../../utils/stringUtil';

export default function ProfileDetailItem({ title, text }) {
  return (
    <Box sx={{ pb: 1 }}>
      <Grid item>
        <Grid item>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {stringOrPlaceholder(title)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography paragraph variant="body1">
            {stringOrPlaceholder(text)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
