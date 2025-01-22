import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import { parseError, zodFields } from '../../utils/zodUtil';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { ResetPasswordBody, useResetPassword } from '../../data/auth/useResetPassword';
import PasswordField from '../../components/form/PasswordField';
import Head from '../../components/common/Head';

const newPasswordFormSchema = z.object({
  newPassword: zodFields.password,
  otp: zodFields.otp,
  twoFactorCode: zodFields.optionalOtp,
});

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      newPassword: '',
      otp: '',
      twoFactorCode: '',
    },
    resolver: zodResolver(newPasswordFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const resetPassword = useResetPassword();
  const email = state?.email;
  const is2FAEnabled = state?.is2FAEnabled;

  const onSubmit = async (body: Partial<ResetPasswordBody>) => {
    if (!email) return navigate('/forgot-password', { replace: true });

    resetPassword.mutate({ ...body, email } as ResetPasswordBody, {
      onSuccess: (message) => {
        navigate('/login', { replace: true });
        showSuccessSnackbar(message);
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
    <Container maxWidth="sm">
      <Head pageTitle="Reset Password" />
      <Box sx={{ textAlign: 'center' }}>
        <h1>Reset password</h1>
      </Box>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            sx={{
              gap: 4,
              width: '100%',
              maxWidth: 'sm',
              alignSelf: 'center',
            }}
          >
            <Typography>
              Enter the one-time code sent to your email ({email}), your new password and 2FA code
              if requested.
            </Typography>

            <PasswordField name="newPassword" label="New password" autoComplete="new-password" />
            <TextField name="otp" label="One-time code" autoComplete="one-time-code" />
            <Stack
              sx={{
                gap: 1,
              }}
            >
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
            <Button
              loading={resetPassword.isPending}
              type="submit"
              variant="contained"
              color="primary"
            >
              Continue
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
}
