import { GridLegacy, Typography } from '@mui/material';

export default function ListEmpty() {
  return (
    <GridLegacy
      container
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        pt: 3,
      }}
    >
      <GridLegacy item>
        <Typography variant="h6">List empty</Typography>
      </GridLegacy>
      <GridLegacy item>
        <Typography
          sx={{
            pt: 1,
          }}
        >
          Create a new item to get started!
        </Typography>
      </GridLegacy>
    </GridLegacy>
  );
}
