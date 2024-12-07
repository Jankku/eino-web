import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { parseError, zodFields } from '../../utils/zodUtil';
import { FormProvider, useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useSendEmailConfirmation } from '../../data/profile/useSendEmailConfirmation';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useVerifyEmail } from '../../data/profile/useVerifyEmail';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';

const totpFormSchema = z.object({
  otp: z.optional(zodFields.otp),
});

export default function ProfileVerifyEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: { otp: '' },
    resolver: zodResolver(totpFormSchema),
  });
  const {
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = formMethods;
  const sendConfirmation = useSendEmailConfirmation();
  const verifyEmail = useVerifyEmail();
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState();

  useEffect(() => {
    if (state?.email) setEmail(state.email);
  }, [state]);

  const onSendConfirmation = () => {
    clearErrors('root.serverError');
    sendConfirmation.mutate(undefined, {
      onSuccess: () => {
        setShowOtpField(true);
      },
      onError: async (error) => {
        const errors = await parseError(error as HTTPError);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  const onVerify = async ({ otp }: { otp: string }) => {
    clearErrors('root.serverError');
    verifyEmail.mutate(otp, {
      onSuccess: () => {
        navigate('/profile', { replace: true });
        showSuccessSnackbar('Email verified successfully');
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
      <h1>Verify email</h1>
      <Stack spacing={1}>
        {!showOtpField ? (
          <Stack
            spacing={3}
            sx={{
              alignItems: 'start',
            }}
          >
            <Typography component="p">
              Email to verify: {email ? email : 'No email found'}
            </Typography>
            <LoadingButton
              loading={sendConfirmation.isPending}
              variant="contained"
              color="primary"
              onClick={onSendConfirmation}
            >
              Send confirmation
            </LoadingButton>
          </Stack>
        ) : undefined}
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onVerify)}>
            {showOtpField ? (
              <Stack
                spacing={3}
                sx={{
                  alignItems: 'start',
                  maxWidth: 'fit-content',
                }}
              >
                <Typography>Email sent! Check your email for a one-time code.</Typography>
                <TextField
                  autoFocus
                  name="otp"
                  label="Enter your one-time code"
                  autoComplete="one-time-code"
                />
                <LoadingButton
                  loading={verifyEmail.isPending}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Verify email
                </LoadingButton>
              </Stack>
            ) : undefined}
          </form>
        </FormProvider>
        {errors.root?.serverError?.message ? (
          <ErrorMessage message={errors.root.serverError.message} />
        ) : null}
      </Stack>
    </Container>
  );
}
