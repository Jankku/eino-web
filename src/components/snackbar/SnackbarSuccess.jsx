import { Fade, IconButton, Snackbar } from '@material-ui/core';
import { useState } from 'react';
import Alert from '@material-ui/core/Alert';
import { CheckCircleOutline } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
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
