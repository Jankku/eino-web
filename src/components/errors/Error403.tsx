import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router';

export default function Error403() {
  return (
    <>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            mt: 4,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 0,
            }}
          >
            Unauthorized
          </Typography>
          <p>You do not have permission to access this page.</p>
          <Button variant="contained" color="primary" component={Link} to="/">
            Home
          </Button>
        </Box>
      </Container>
    </>
  );
}
