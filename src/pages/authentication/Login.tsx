import { Box, Container, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useToken } from '../../hooks/useToken';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { useLoginUser } from '../../data/auth/useLoginUser';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import PasswordField from '../../components/form/PasswordField';
import { parseError } from '../../utils/zodUtil';
import { Credentials, credentialsSchema } from '../../data/auth/auth.schema';
import { HTTPError } from 'ky';
import { useLoginConfig } from '../../data/auth/useLoginConfig';
import { useRedirect } from '../../hooks/useRedirect';
import Head from '../../components/common/Head';

export default function Login() {
  const navigate = useNavigate();
  const redirectTo = useRedirect();
  const { setToken, setRefreshToken } = useToken();
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(credentialsSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const loginConfig = useLoginConfig();
  const loginUser = useLoginUser();

  const onSubmit = async (credentials: Credentials) => {
    loginConfig.mutate(credentials, {
      onSuccess: (data) => {
        if (data.is2FAEnabled) {
          navigate(`/login/2fa?redirectTo=${redirectTo}`, { state: { credentials } });
        } else {
          loginUser.mutate(credentials, {
            onSuccess: (data) => {
              setToken(data.accessToken);
              setRefreshToken(data.refreshToken);
              navigate(redirectTo);
            },
            onError: async (error) => {
              const errors = await parseError(error as HTTPError);
              setError('root.serverError', {
                message: errors[0].message,
              });
            },
          });
        }
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
    <Container maxWidth="md">
      <Head pageTitle="Login" />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Login</h1>
            </Box>
            <Stack
              sx={{
                gap: 4,
                width: '100%',
                maxWidth: 'sm',
                alignSelf: 'center',
              }}
            >
              <TextField
                autoFocus
                name="username"
                label="Username or email"
                autoComplete="username"
              />
              <Stack
                sx={{
                  gap: 1,
                }}
              >
                <PasswordField name="password" label="Password" />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>
              <Stack>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <LoadingButton
                    loading={loginConfig.isPending || loginUser.isPending}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </LoadingButton>
                  <Typography component="p" align="left">
                    <Typography component={Link} to="/forgot-password">
                      <Box
                        component="span"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'underline',
                        }}
                      >
                        Forgot password?
                      </Box>
                    </Typography>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
}
