import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { Button, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { useRevokeUserSessions } from '../../data/admin/useRevokeUserSessions';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { parseError } from '../../utils/zodUtil';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../authentication/ErrorMessage';

type RevokeSessionsDialogProps = {
  userId: string;
  username: string;
  visible: boolean;
  onClose: () => void;
};

export default function RevokeSessionsDialog({
  userId,
  username,
  visible,
  onClose,
}: RevokeSessionsDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const revokeSessions = useRevokeUserSessions();
  const formMethods = useForm();
  const {
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = formMethods;

  const onSubmit = () => {
    revokeSessions.mutate(userId, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
        handleClose();
      },
      onError: async (error) => {
        const errors = parseError(error);
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
    <BaseDialog title="Revoke sessions" open={visible} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to revoke all sessions of the user <strong>{username}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            The user will be logged out of every device. The account stays enabled, so they can log
            in again.
          </Typography>
          {errors.root?.serverError?.message ? (
            <ErrorMessage message={errors.root.serverError.message} />
          ) : null}
        </DialogContent>
        <DialogFooter>
          <Button color="inherit" onClick={onClose}>
            Close
          </Button>
          <DialogPrimaryButton color="error" loading={revokeSessions.isPending} type="submit">
            Revoke sessions
          </DialogPrimaryButton>
        </DialogFooter>
      </form>
    </BaseDialog>
  );
}
