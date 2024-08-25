import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import { useGenerate2FAUrl } from '../../data/profile/useGenerate2FAUrl';
import { useEnable2FA } from '../../data/profile/useEnable2FA';

const totpFormSchema = z.object({
  otp: zodFields.otp,
});

type Enable2FADialogProps = {
  visible: boolean;
  closeDialog: () => void;
};

export default function Enable2FADialog({ visible, closeDialog }: Enable2FADialogProps) {
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
  const { data, isLoading, isError } = useGenerate2FAUrl(visible);
  const enable2FA = useEnable2FA();

  const resetState = () => {
    resetForm();
    enable2FA.reset();
    closeDialog();
  };

  const onSubmit = ({ otp }: { otp: string }) => {
    enable2FA.mutate(otp, {
      onSuccess: () => {
        closeDialog();
        showSuccessSnackbar('2FA enabled successfully');
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
    <BaseDialog open={visible} onClose={() => resetState()}>
      <DialogTitle>Enable Two Factor Authentication (2FA)</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            {isLoading ? (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : null}
            {isError ? <Typography paragraph>Failed to load QR code</Typography> : undefined}
            {data?.totpUrl ? (
              <Stack spacing={2}>
                <Typography paragraph>
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
                <Box
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.default,
                    wordBreak: 'break-all',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  })}
                >
                  <Typography fontFamily="monospace">{data.totpUrl}</Typography>
                </Box>
                <TextField autoFocus name="otp" label="Enter your one-time code" />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>
            ) : undefined}
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
            <LoadingButton loading={enable2FA.isPending} color="primary" type="submit">
              Enable 2FA
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
