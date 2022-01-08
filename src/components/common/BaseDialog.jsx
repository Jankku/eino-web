import { useTheme } from '@mui/system';
import { Dialog, useMediaQuery } from '@mui/material';

function BaseDialog({ children, ...props }) {
  const theme = useTheme();
  const fullscreenBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog {...props} fullScreen={fullscreenBelowMd}>
      {children}
    </Dialog>
  );
}

export default BaseDialog;
