import DialogFooter, { DialogPrimaryButton } from '../common/DialogFooter';
import { Box, Button, CircularProgress, DialogContent, Stack, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { z } from 'zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import TextField from '../form/TextField';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useGenerate2FAUrl } from '../../data/profile/useGenerate2FAUrl';
import { useEnable2FA } from '../../data/profile/useEnable2FA';
import CodeBlock from '../common/CodeBlock';

const totpFormSchema = z.object({
  twoFactorCode: zodFields.otp,
});

type Enable2FADialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function Enable2FADialog({ visible, closeDialog }: Enable2FADialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: { twoFactorCode: '' },
    resolver: zodResolver(totpFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const { data, isLoading, isError } = useGenerate2FAUrl(visible);
  const twoFactorCode = useWatch({ control: formMethods.control, name: 'twoFactorCode' });
  const enable2FA = useEnable2FA();

  const resetState = () => {
    resetForm();
    enable2FA.reset();
    closeDialog();
  };

  const onSubmit = ({ twoFactorCode }: { twoFactorCode: string }) => {
    enable2FA.mutate(twoFactorCode, {
      onSuccess: () => {
        showSuccessSnackbar('2FA enabled');
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
    <BaseDialog
      title="Enable Two-Factor Authentication (2FA)"
      open={visible}
      onClose={() => resetState()}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            {isLoading ? (
              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}
              >
                <CircularProgress />
              </Stack>
            ) : null}
            {isError ? <Typography component="p">Failed to load QR code</Typography> : undefined}
            {data?.totpUrl ? (
              <Stack spacing={2}>
                <Typography component="p">
                  Scan the QR code or use the URL below to set up your authenticator app. After that
                  enter the 6 digit one-time code from the app to the text field below.
                </Typography>
                <Box sx={{ width: { sx: '100%', sm: '50%' }, alignSelf: 'center' }}>
                  <img
                    draggable="false"
                    src={data.qrCodeUrl}
                    alt="QR code"
                    style={{ width: '100%' }}
                  />
                </Box>
                <CodeBlock>{data.totpUrl}</CodeBlock>
                <Stack spacing={1}>
                  <TextField
                    name="twoFactorCode"
                    label="Enter your two-factor code"
                    autoComplete="one-time-code"
                  />
                  {errors.root?.serverError?.message ? (
                    <ErrorMessage message={errors.root.serverError.message} />
                  ) : null}
                </Stack>
              </Stack>
            ) : undefined}
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
              loading={enable2FA.isPending}
              disabled={!twoFactorCode.trim() || isLoading || isError || !data?.totpUrl}
              type="submit"
            >
              Enable 2FA
            </DialogPrimaryButton>
          </DialogFooter>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
