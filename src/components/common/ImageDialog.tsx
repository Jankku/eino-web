import { Button, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import BaseDialog from './BaseDialog';
import React from 'react';

type ImageDialogProps = {
  visible: boolean;
  title: string;
  sources: React.ReactNode;
  closeDialog: () => void;
  children: React.ReactNode;
};

export default function ImageDialog({
  visible,
  title,
  sources,
  closeDialog,
  children,
}: ImageDialogProps) {
  return (
    <BaseDialog title={title} open={visible} onClose={closeDialog} hideBackdrop>
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
