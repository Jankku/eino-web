import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { useDeleteUser } from '../../data/admin/useDeleteUser';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { HTTPError } from 'ky';
import { parseError } from '../../utils/zodUtil';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../authentication/ErrorMessage';

type DeleteUserDialogProps = {
  userId: string;
  username: string;
  visible: boolean;
  onClose: () => void;
};

export default function DeleteUserDialog({
  userId,
  username,
  visible,
  onClose,
}: DeleteUserDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const deleteUser = useDeleteUser();
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = formMethods;

  const onSubmit = () => {
    deleteUser.mutate(userId, {
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

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <BaseDialog title="Delete user" open={visible} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete the user <strong>{username}</strong>?
          </Typography>
          {errors.root?.serverError?.message ? (
            <ErrorMessage message={errors.root.serverError.message} />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
          <LoadingButton loading={deleteUser.isPending} color="secondary" type="submit">
            Delete user
          </LoadingButton>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}
