import DialogFooter from './DialogFooter';
import { Button, DialogContent, DialogContentText } from '@mui/material';
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
    <BaseDialog
      title={title}
      open={visible}
      onClose={closeDialog}
      hideBackdrop
      fullWidth
      slotProps={{ paper: { sx: { height: { md: 'min(700px, calc(100% - 64px))' } } } }}
    >
      <DialogContent sx={{ paddingTop: 0, scrollbarGutter: 'stable' }}>
        <DialogContentText>Sources: {sources}</DialogContentText>
        {children}
      </DialogContent>
      <DialogFooter>
        <Button
          color="inherit"
          onClick={() => {
            closeDialog();
          }}
        >
          Close
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}
