import { Button, ButtonProps, IconButton, Tooltip } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';

type ResponsiveButtonProps = Pick<
  ButtonProps,
  'id' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
> & {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: string;
};

export default function ResponsiveButton({
  icon,
  disabled,
  onClick,
  children,
  ...ariaProps
}: ResponsiveButtonProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Tooltip arrow title={children} enterTouchDelay={500}>
          <span>
            <IconButton
              {...ariaProps}
              aria-label={children}
              color="primary"
              size="large"
              onClick={onClick}
              disabled={disabled}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button
          {...ariaProps}
          variant="outlined"
          startIcon={icon}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </Button>
      )}
    </>
  );
}
