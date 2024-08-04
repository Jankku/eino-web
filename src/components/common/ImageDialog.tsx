import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
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
