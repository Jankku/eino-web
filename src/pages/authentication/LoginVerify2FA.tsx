import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { useLoginUser } from '../../data/auth/useLoginUser';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import { parseError, zodFields } from '../../utils/zodUtil';
import { credentialsSchema } from '../../data/auth/auth.schema';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useToken } from '../../hooks/useToken';
import { useRedirect } from '../../hooks/useRedirect';
import Head from '../../components/common/Head';

const locationStateSchema = z.object({
  credentials: credentialsSchema,
});

const otpFormSchema = z.object({
  twoFactorCode: zodFields.otp,
});

export default function LoginVerify2FA() {
  const { state } = useLocation();
  const redirectTo = useRedirect();
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();
  const formMethods = useForm({
    defaultValues: {
      twoFactorCode: '',
    },
    resolver: zodResolver(otpFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const loginUser = useLoginUser();

  const onSubmit = async ({ twoFactorCode }: { twoFactorCode: string }) => {
    const locationState = locationStateSchema.safeParse(state);
    if (!locationState.success) {
      navigate('/login', { replace: true });
      return;
    }
    const credentials = locationState.data.credentials;

    loginUser.mutate(
      { ...credentials, twoFactorCode },
      {
        onSuccess: (data) => {
          setToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          navigate(redirectTo, { replace: true });
        },
        onError: async (error) => {
          const errors = await parseError(error as HTTPError);
          setError('root.serverError', {
            message: errors[0].message,
          });
        },
      },
    );
  };

  return (
    <Container maxWidth="sm">
      <Head pageTitle="Verify identity" />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Verify Your Identity</h1>
            </Box>
            <Stack
              sx={{
                gap: 4,
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <Typography>Check your preferred authenticator app for the one-time code.</Typography>
              <Stack spacing={1}>
                <TextField
                  autoFocus
                  name="twoFactorCode"
                  label="Enter your 2FA code"
                  autoComplete="one-time-code"
                />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>
              <Button
                loading={loginUser.isPending}
                type="submit"
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
}
