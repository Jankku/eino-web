import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { parseError, zodFields } from '../../utils/zodUtil';
import { FormProvider, useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import { useEffect, useState } from 'react';
import { useSendEmailConfirmation } from '../../data/profile/useSendEmailConfirmation';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useVerifyEmail } from '../../data/profile/useVerifyEmail';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import Head from '../../components/common/Head';

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
      <Head pageTitle="Verify email" />
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
            <Button
              loading={sendConfirmation.isPending}
              variant="contained"
              color="primary"
              onClick={onSendConfirmation}
            >
              Send confirmation
            </Button>
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
                <Button
                  loading={verifyEmail.isPending}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Verify email
                </Button>
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
