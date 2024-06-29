import { Container, Typography, Box } from '@mui/material';

export default function Error404() {
  return (
    <>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box mt={4}>
          <Typography component="h1" variant="h4" mb={0}>
            Page Not Found
          </Typography>
          <p>I can&apos;t find it... 😭</p>
        </Box>
      </Container>
    </>
  );
}
