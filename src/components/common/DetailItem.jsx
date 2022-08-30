import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { stringOrPlaceholder } from '../../utils/stringUtil';

export default function DetailItem({ title, text }) {
  return (
    <Box sx={{ padding: '0.3em' }}>
      <Grid item>
        <Grid item>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {stringOrPlaceholder(title)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="body2"
            noWrap
            paragraph
            sx={{
              width: '20em',
            }}
          >
            {stringOrPlaceholder(text)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
