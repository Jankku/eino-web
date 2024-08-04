import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

type InfoCardButtonProps = {
  icon: React.ReactNode;
  to: string;
  children: React.ReactNode;
};

export default function InfoCardButton({ icon, to, children }: InfoCardButtonProps) {
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
