import { Button, IconButton, Tooltip } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';

type ResponsiveButtonProps = {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export default function ResponsiveButton({
  icon,
  disabled,
  onClick,
  children,
}: ResponsiveButtonProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Tooltip arrow title={children} enterTouchDelay={500}>
          <span>
            <IconButton color="primary" size="large" onClick={onClick} disabled={disabled}>
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button variant="outlined" startIcon={icon} disabled={disabled} onClick={onClick}>
          {children}
        </Button>
      )}
    </>
  );
}
