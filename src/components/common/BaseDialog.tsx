import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';

function BaseDialog({ children, ...props }: DialogProps) {
  const theme = useTheme();
  const fullscreenBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  const open = props.open;

  useEffect(() => {
    if (!open) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [open]);

  return (
    <Dialog {...props} fullScreen={fullscreenBelowMd}>
      {children}
    </Dialog>
  );
}

export default BaseDialog;
