import { Button } from '@mui/material';

function CardActionButton({ children, onClick }) {
  return (
    <Button variant="outlined" size="small" onClick={() => onClick()}>
      {children}
    </Button>
  );
}

export default CardActionButton;
