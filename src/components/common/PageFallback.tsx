import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Refresh from '@mui/icons-material/Refresh';

type PageFallbackProps = {
  resetErrorBoundary: () => void;
};

export default function PageFallback({ resetErrorBoundary }: PageFallbackProps) {
  return (
    <Box mt={8} textAlign="center">
      <Typography variant="h5" component="p">
        Failed to load page. 😭
      </Typography>
      <Button startIcon={<Refresh />} variant="contained" onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </Box>
  );
}
