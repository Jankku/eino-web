import { Button } from '@mui/material';

type CardActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function CardActionButton({ children, onClick }: CardActionButtonProps) {
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
