import { Container, Typography, Stack, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../../data/auth/useRegisterUser';
import ErrorMessage from '../../components/authentication/ErrorMessage.tsx';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField.tsx';
import PasswordField from '../../components/form/PasswordField.tsx';
import { parseError, zodFields } from '../../utils/zodUtil';
import PasswordStrengthMeter from '../../components/authentication/PasswordStrengthMeter';
import { usePasswordStrength } from '../../data/auth/usePasswordStrength';
import { useDebounce } from '../../hooks/useDebounce';
import { Credentials } from '../../data/auth/auth.schema';
import { HTTPError } from 'ky';

const registerSchema = z
  .object({
    username: zodFields.username,
    email: zodFields.optionalEmail,
    password: zodFields.password,
    password2: zodFields.password,
  })
  .superRefine(({ password, password2 }, ctx) => {
    if (password !== password2) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['password2'],
      });
    }
  });

export default function Register() {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      username: '',
      email: null,
      password: '',
      password2: '',
    },
    resolver: zodResolver(registerSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = formMethods;
  const registerUser = useRegisterUser();
  const watchPassword = watch('password');
  const debouncedPassword = useDebounce(watchPassword, 200);
  const { data: passwordStrength } = usePasswordStrength(debouncedPassword);
  const passwordScore = watchPassword.length ? (passwordStrength?.score ?? 0) : 0;
  const passwordMessage = passwordStrength?.message || 'Input a password to see the guide';

  const onSubmit = (credentials: Credentials) => {
    registerUser.mutate(credentials, {
      onSuccess: () => navigate('/login'),
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
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Box sx={{ textAlign: 'center' }}>
              <h1>Register</h1>
            </Box>
            <Stack gap={4} width="100%" maxWidth="sm" alignSelf="center">
              <TextField
                autoFocus
                name="username"
                label="Username"
                autoComplete="username"
                helperText="Username should be 3-255 characters long"
              />
              <TextField
                name="email"
                label="Email"
                autoComplete="email"
                helperText="Email is optional"
              />
              <Stack>
                <PasswordField
                  name="password"
                  label="Password"
                  helperText="Password should be 8-255 characters long"
                  autoComplete="new-password"
                />
                <Stack direction="column" gap={1} pt={2}>
                  <PasswordStrengthMeter score={passwordScore} />
                  <Typography variant="caption" color="text.secondary">
                    {passwordMessage}
                  </Typography>
                </Stack>
              </Stack>
              <Stack gap={1}>
                <PasswordField
                  name="password2"
                  label="Confirm password"
                  autoComplete="new-password"
                />
                {errors.root?.serverError?.message ? (
                  <ErrorMessage message={errors.root.serverError.message} />
                ) : null}
              </Stack>

              <Stack>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <LoadingButton
                    loading={registerUser.isPending}
                    disabled={passwordScore < 3}
                    type="submit"
                    variant="contained"
                  >
                    Register
                  </LoadingButton>
                  <Typography paragraph align="left">
                    Already have an account?{' '}
                    <Typography component={Link} to="/login">
                      <Box
                        component="span"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'underline',
                        }}
                      >
                        Login
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
