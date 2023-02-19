import { Button } from '@mui/material';

function CardActionButton({ children, onClick }) {
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </Button>
  );
}

export default CardActionButton;
