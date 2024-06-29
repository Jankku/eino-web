import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function InfoCardButton({ icon, to, children }) {
  return (
    <Button
      fullWidth
      component={Link}
      to={to}
      rel="noreferrer"
      variant="contained"
      startIcon={icon}
      sx={{ marginTop: '1em' }}
    >
      {children}
    </Button>
  );
}
