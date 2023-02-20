import { Button } from '@mui/material';

export default function InfoCardButton({ icon, children }) {
  return (
    <Button variant="contained" startIcon={icon} sx={{ marginTop: '1em' }} fullWidth>
      {children}
    </Button>
  );
}
