import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Refresh from '@mui/icons-material/Refresh';

function PageFallback({ resetErrorBoundary }) {
  return (
    <Box mt={8} textAlign="center">
      <Typography variant="h5" paragraph>
        Failed to load page. 😭
      </Typography>
      <Button startIcon={<Refresh />} variant="contained" onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </Box>
  );
}

export default PageFallback;
