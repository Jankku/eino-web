import { Fade, IconButton, Snackbar } from '@mui/system';
import { useState } from 'react';
import Alert from '@mui/system/Alert';
import { CheckCircleOutline } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';

export default function SnackbarSuccess({ open, message }) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      key={message}
      open={isOpen}
      onClose={closeSnackbar}
      autoHideDuration={5000}
      TransitionComponent={Fade}
      TransitionProps={{
        in: isOpen,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Alert
        severity="success"
        icon={<CheckCircleOutline fontSize="inherit" />}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
