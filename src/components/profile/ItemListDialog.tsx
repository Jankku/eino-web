import DialogFooter from '../common/DialogFooter';
import { Button, DialogContent } from '@mui/material';
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
    <BaseDialog
      title={title}
      open={visible}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { sx: { height: { md: 'min(700px, calc(100% - 64px))' } } } }}
    >
      <DialogContent sx={{ pt: 0, scrollbarGutter: 'stable' }}>{children}</DialogContent>
      <DialogFooter>
        <Button color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}
