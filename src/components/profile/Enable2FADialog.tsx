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
      fullWidth
    >
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          <DialogContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <Typography component="p">
                Scan the QR code or use the URL below to set up your authenticator app. After that
                enter the 6 digit one-time code from the app to the text field below.
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 224,
                  aspectRatio: '1',
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoading ? <CircularProgress /> : null}
                {isError ? <Typography component="p">Failed to load QR code</Typography> : null}
                {data?.totpUrl ? (
                  <img
                    draggable="false"
                    src={data.qrCodeUrl}
                    alt="QR code"
                    width={224}
                    height={224}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : null}
              </Box>
              <Box sx={{ height: 112, overflowY: 'auto' }}>
                <CodeBlock>{data?.totpUrl ?? '\u00a0'}</CodeBlock>
              </Box>
              <Stack spacing={1}>
                <TextField
                  name="twoFactorCode"
                  label="Enter your two-factor code"
                  autoComplete="one-time-code"
                  disabled={!data?.totpUrl}
                />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>
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
