import { Box, Container, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { useLoginUser } from '../../data/auth/useLoginUser';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import { parseError, zodFields } from '../../utils/zodUtil';
import { credentialsSchema } from '../../data/auth/auth.schema';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useToken } from '../../hooks/useToken';
import { useAuthContext } from '../../providers/AuthenticationProvider';

const locationStateSchema = z.object({
  credentials: credentialsSchema,
});

const otpFormSchema = z.object({
  otp: zodFields.otp,
});

export default function LoginOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  const formMethods = useForm({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(otpFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const loginUser = useLoginUser();

  const onSubmit = async ({ otp }: { otp: string }) => {
    const locationState = locationStateSchema.safeParse(state);
    if (!locationState.success) {
      navigate('/login');
      return;
    }
    const credentials = locationState.data.credentials;

    loginUser.mutate(
      { ...credentials, otp },
      {
        onSuccess: (data) => {
          setToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          setIsLoggedIn(true);
          navigate('/books');
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
    <Container maxWidth="md">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Verify Your Identity</h1>
            </Box>
            <Stack gap={4} width="100%" maxWidth="sm" alignSelf="center">
              <Typography>
                Check your preferred one-time password application for a code.
              </Typography>
              <TextField autoFocus name="otp" label="Enter your one-time code" />
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
              <LoadingButton
                loading={loginUser.isPending}
                type="submit"
                variant="contained"
                color="primary"
              >
                Continue
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
}
