import { Box, Container, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { useLoginUser } from '../../data/auth/useLoginUser';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import PasswordField from '../../components/form/PasswordField';
import { parseError, zodFields } from '../../utils/zodUtil';

const loginSchema = z.object({
  username: zodFields.username,
  password: zodFields.password,
});

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  const formMethods = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const loginUser = useLoginUser();

  const onSubmit = async (credentials) => {
    loginUser.mutate(credentials, {
      onSuccess: (data) => {
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setIsLoggedIn(true);
        navigate('/books');
      },
      onError: async (error) => {
        const errors = await parseError(error);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  return (
    <Container maxWidth="md">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Login</h1>
            </Box>
            <Stack gap={4} width="100%" maxWidth="sm" alignSelf="center">
              <TextField autoFocus name="username" label="Username" autoComplete="username" />
              <PasswordField name="password" label="Password" />

              <Stack>
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}

                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <LoadingButton
                    loading={loginUser.isPending}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </LoadingButton>
                  <Typography align="left" paragraph>
                    Don&apos;t have an account yet?{' '}
                    <Link to="/register">
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'underline',
                        }}
                      >
                        Register
                      </Typography>
                    </Link>
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
