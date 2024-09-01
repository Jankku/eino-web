import { Dialog, DialogProps, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';

interface BaseDialogProps extends DialogProps {
  title: string;
}

function BaseDialog({ title, children, ...props }: BaseDialogProps) {
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
  }, [open, props]);

  return (
    <Dialog {...props} fullScreen={fullscreenBelowMd}>
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  );
}

export default BaseDialog;
