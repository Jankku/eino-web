import { Typography, Stack, Box } from '@mui/material';

export default function ListEmpty() {
  return (
    <Stack direction="column" sx={{ flexWrap: 'wrap', width: '100%', alignItems: 'center', pt: 3 }}>
      <Box>
        <Typography variant="h6">List empty</Typography>
      </Box>
      <Box>
        <Typography
          sx={{
            pt: 1,
          }}
        >
          Create a new item to get started!
        </Typography>
      </Box>
    </Stack>
  );
}
