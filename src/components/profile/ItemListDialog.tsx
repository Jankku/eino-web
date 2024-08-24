import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import BaseDialog from '../common/BaseDialog';

type ItemListDialog = {
  title: string;
  visible: boolean;
  closeDialog: () => void;
  children: React.ReactNode;
};

export default function ItemListDialog({ title, visible, closeDialog, children }: ItemListDialog) {
  const onClose = () => {
    closeDialog();
  };

  return (
    <BaseDialog open={visible} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>{children}</DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
