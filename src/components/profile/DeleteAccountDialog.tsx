import { Button, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseDialog from '../common/BaseDialog';
import { useDeleteAccount } from '../../data/profile/useDeleteAccount';
import { LoadingButton } from '@mui/lab';
import PasswordField from '../form/PasswordField';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';

const passwordFormSchema = z.object({
  password: zodFields.password,
});

type DeleteAccountDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

function DeleteAccountDialog({ visible, closeDialog }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const deleteAccount = useDeleteAccount();

  const resetState = () => {
    resetForm();
    deleteAccount.reset();
    closeDialog();
  };

  const onSubmit = ({ password }: { password: string }) => {
    deleteAccount.mutate(password, {
      onSuccess: () => {
        closeDialog();
        navigate('/logout');
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
    <BaseDialog maxWidth="xs" open={visible} onClose={() => resetState()}>
      <DialogTitle>Delete account</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography paragraph fontWeight={700} color="error">
              NOTE: THIS ACTION IS IRREVERSIBLE!
            </Typography>
            <Typography paragraph variant="body1">
              This action will permanently delete your account and all associated data. Please
              confirm your password before proceeding.
            </Typography>
            <PasswordField autoFocus name="password" label="Confirm password" />
            {errors.root?.serverError?.message ? (
              <ErrorMessage message={errors.root.serverError.message} />
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => {
                resetState();
              }}
            >
              Cancel
            </Button>
            <LoadingButton loading={deleteAccount.isPending} color="primary" type="submit">
              Delete account
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}

export default DeleteAccountDialog;
