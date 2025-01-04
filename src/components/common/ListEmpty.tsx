import { Grid, Typography } from '@mui/material';

export default function ListEmpty() {
  return (
    <Grid
      container
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        pt: 3,
      }}
    >
      <Grid item>
        <Typography variant="h6">List empty</Typography>
      </Grid>
      <Grid item>
        <Typography
          sx={{
            pt: 1,
          }}
        >
          Create a new item to get started!
        </Typography>
      </Grid>
    </Grid>
  );
}
