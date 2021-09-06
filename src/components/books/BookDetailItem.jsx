import { Grid, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';

export default function BookDetailItem({ title, text }) {
  return (
    <Box sx={{ padding: '0.3em' }}>
      <Grid item>
        <Grid item>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700 }}
          >{`${title}`}</Typography>
        </Grid>
        <Grid
          item
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography
            variant="body2"
            noWrap={true}
            paragraph={true}
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '20em',
            }}
          >{`${text.length > 0 ? text : '-'}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
