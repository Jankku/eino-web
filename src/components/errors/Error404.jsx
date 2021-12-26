import { Container } from '@mui/material';
import { Box } from '@mui/system';

export default function Error404() {
  return (
    <>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box sx={{ marginTop: '0.5em', typography: 'h3' }}>404 Not Found</Box>
        <Box sx={{ padding: '0.5em 0em 0em 0em', typography: 'body1' }}>
          I can't find the page... 😭
        </Box>
      </Container>
    </>
  );
}
