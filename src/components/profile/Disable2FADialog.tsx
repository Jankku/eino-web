import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import TextField from '../form/TextField';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useDisable2FA } from '../../data/profile/useDisable2FA';

const totpFormSchema = z.object({
  otp: zodFields.otp,
});

type Disable2FADialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function Disable2FADialog({ visible, closeDialog }: Disable2FADialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: { otp: '' },
    resolver: zodResolver(totpFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const disable2FA = useDisable2FA();

  const resetState = () => {
    resetForm();
    disable2FA.reset();
    closeDialog();
  };

  const onSubmit = ({ otp }: { otp: string }) => {
    disable2FA.mutate(otp, {
      onSuccess: () => {
        closeDialog();
        showSuccessSnackbar('2FA disabled successfully');
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
    <BaseDialog
      title="Disable Two Factor Authentication (2FA)"
      maxWidth="xs"
      open={visible}
      onClose={() => resetState()}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <Typography paragraph>
                Disabling 2FA will remove an extra layer of security from your account. Are you sure
                you want to disable 2FA?
              </Typography>
              <Stack spacing={1}>
                <TextField
                  autoFocus
                  name="otp"
                  label="Enter your one-time code"
                  autoComplete="one-time-code"
                />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>
            </Stack>
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
            <LoadingButton loading={disable2FA.isPending} color="primary" type="submit">
              Disable 2FA
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
