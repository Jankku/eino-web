import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import BaseDialog from './BaseDialog';

export default function ImageDialog({ visible, title, sources, closeDialog, children }) {
  return (
    <BaseDialog open={visible} onClose={closeDialog} hideBackdrop>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ paddingTop: 0 }}>
        <DialogContentText>Sources: {sources}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={() => {
            closeDialog();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
