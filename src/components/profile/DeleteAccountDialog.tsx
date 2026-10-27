import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { Button, DialogContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import BaseDialog from '../common/BaseDialog';
import { DeleteAccountBody, useDeleteAccount } from '../../data/profile/useDeleteAccount';
import PasswordField from '../form/PasswordField';
import { z } from 'zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import TextField from '../form/TextField';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';

const passwordFormSchema = z.object({
  password: zodFields.password,
  twoFactorCode: zodFields.optionalOtp,
});

type DeleteAccountDialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

function DeleteAccountDialog({ visible, closeDialog }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const { is2FAEnabled } = useAuthContext();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      password: '',
      twoFactorCode: '',
    },
    resolver: zodResolver(passwordFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const [password, twoFactorCode] = useWatch({
    control: formMethods.control,
    name: ['password', 'twoFactorCode'],
  });
  const deleteButtonDisabled = !password || (is2FAEnabled && !twoFactorCode?.trim());
  const deleteAccount = useDeleteAccount();

  const resetState = () => {
    resetForm();
    deleteAccount.reset();
    closeDialog();
  };

  const onSubmit = (body: DeleteAccountBody) => {
    deleteAccount.mutate(body, {
      onSuccess: (message) => {
        showSuccessSnackbar(message);
        navigate('/logout');
        closeDialog();
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
    <BaseDialog title="Delete account" maxWidth="xs" open={visible} onClose={() => resetState()}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Stack
              sx={{
                gap: 1,
                mb: 2,
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontWeight: 700,
                  color: 'error.main',
                }}
              >
                NOTE: THIS ACTION IS IRREVERSIBLE!
              </Typography>
              <Typography component="p" variant="body1">
                This action will permanently delete your account and all associated data. Confirm
                your password to proceed.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <PasswordField autoFocus name="password" label="Confirm password" />
              {is2FAEnabled ? (
                <TextField
                  name="twoFactorCode"
                  label="Enter your 2FA code"
                  autoComplete="one-time-code"
                />
              ) : undefined}

              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </Stack>
          </DialogContent>
          <DialogFooter>
            <Button
              color="inherit"
              onClick={() => {
                resetState();
              }}
            >
              Cancel
            </Button>
            <DialogPrimaryButton
              color="error"
              loading={deleteAccount.isPending}
              disabled={deleteButtonDisabled}
              type="submit"
            >
              Delete account
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}

export default DeleteAccountDialog;
