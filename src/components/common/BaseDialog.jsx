import { useTheme } from '@mui/system';
import { Dialog, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';

function BaseDialog({ children, ...props }) {
  const theme = useTheme();
  const fullscreenBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  const open = props.open;

  useEffect(() => {
    if (!open) return;

    const handleBeforeUnload = (event) => {
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
