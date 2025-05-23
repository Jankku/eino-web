import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router';

export default function Error401() {
  const redirectToQueryParam = window.location.pathname
    ? `?redirectTo=${window.location.pathname}`
    : '';
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
          <p>Please login before trying to reach this page</p>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/login${redirectToQueryParam}`}
          >
            Login
          </Button>
        </Box>
      </Container>
    </>
  );
}
