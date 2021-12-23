import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function DetailItem({ title, text }) {
  return (
    <Box sx={{ padding: '0.3em' }}>
      <Grid item>
        <Grid item>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700 }}
          >{`${title}`}</Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="body2"
            noWrap={true}
            paragraph={true}
            sx={{
              width: '20em',
            }}
          >{`${String(text).length > 0 ? text : '-'}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
