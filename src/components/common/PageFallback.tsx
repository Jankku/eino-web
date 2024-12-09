import { Button, Stack, Typography } from '@mui/material';
import Refresh from '@mui/icons-material/Refresh';

type PageFallbackProps = {
  resetErrorBoundary: () => void;
};

export default function PageFallback({ resetErrorBoundary }: PageFallbackProps) {
  return (
    <Stack
      sx={{
        mt: 8,
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h5" component="p">
        Failed to load page. 😭
      </Typography>
      <Button startIcon={<Refresh />} variant="contained" onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </Stack>
  );
}
