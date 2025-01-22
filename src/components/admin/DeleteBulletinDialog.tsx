import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import ErrorMessage from '../authentication/ErrorMessage';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useForm } from 'react-hook-form';
import { parseError } from '../../utils/zodUtil';
import { HTTPError } from 'ky';
import { useDeleteBulletin } from '../../data/admin/useDeleteBulletin';

type DeleteBulletinDialogProps = {
  bulletinId: string;
  bulletinName: string | undefined;
  visible: boolean;
  onClose: () => void;
};

export default function DeleteBulletinDialog({
  bulletinId,
  bulletinName,
  visible,
  onClose,
}: DeleteBulletinDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const deleteBulletin = useDeleteBulletin();
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = formMethods;

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = () => {
    deleteBulletin.mutate(bulletinId, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
        handleClose();
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  return (
    <BaseDialog title="Delete bulletin" open={visible} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete bulletin <strong>{bulletinName}</strong>?
          </Typography>
          {errors.root?.serverError?.message ? (
            <ErrorMessage message={errors.root.serverError.message} />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
          <Button loading={deleteBulletin.isPending} color="secondary" type="submit">
            Delete
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
