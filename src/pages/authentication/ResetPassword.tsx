import { Box, Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import { parseError, zodFields } from '../../utils/zodUtil';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { ResetPasswordBody, useResetPassword } from '../../data/auth/useResetPassword';
import { useEffect } from 'react';
import PasswordField from '../../components/form/PasswordField';

const newPasswordFormSchema = z.object({
  email: zodFields.email,
  newPassword: zodFields.password,
  otp: zodFields.otp,
});

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      email: '',
      newPassword: '',
      otp: '',
    },
    resolver: zodResolver(newPasswordFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = formMethods;
  const resetPassword = useResetPassword();

  useEffect(() => {
    if (state?.email) {
      reset({ email: state.email }, { keepDefaultValues: true });
    }
  }, [state, reset]);

  const onSubmit = async (object: ResetPasswordBody) => {
    resetPassword.mutate(object, {
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
      <Box sx={{ textAlign: 'center' }}>
        <h1>Reset password</h1>
      </Box>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4} width="100%" maxWidth="sm" alignSelf="center">
            <Typography>
              Enter the one-time code sent to your email and your new password.
            </Typography>

            <TextField autoFocus name="email" label="Email" autoComplete="email" />
            <PasswordField name="newPassword" label="New password" autoComplete="new-password" />
            <Stack gap={1}>
              <TextField name="otp" label="One-time code" autoComplete="one-time-code" />
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </Stack>
            <LoadingButton
              loading={resetPassword.isPending}
              type="submit"
              variant="contained"
              color="primary"
            >
              Continue
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
}
