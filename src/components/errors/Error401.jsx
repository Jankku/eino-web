import { Button, Container } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';

export default function Error401() {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box sx={{ marginTop: '0.5em', typography: 'h3' }}>
          401 Unauthorized
        </Box>
        <Box sx={{ padding: '0.5em 0em 1em 0em', typography: 'body1' }}>
          Please login before trying to reach this page.
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Container>
    </>
  );
}
