import { Container, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../../data/auth/useRegisterUser';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import PasswordField from '../../components/form/PasswordField';
import { zodFields } from '../../utils/zodUtil';

const registerSchema = z
  .object({
    username: zodFields.username,
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
      password: '',
      password2: '',
    },
    resolver: zodResolver(registerSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const registerUser = useRegisterUser();

  const onSubmit = (credentials) => {
    registerUser.mutate(credentials, {
      onSuccess: () => navigate('/login'),
      onError: (error) =>
        setError('root.serverError', {
          message: error?.response?.data?.errors[0]?.message,
        }),
    });
  };

  return (
    <Container maxWidth="md">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <Grid item sx={{ textAlign: 'center' }}>
                <h1>Register</h1>
              </Grid>
              <Grid item sx={{ mb: 2 }}>
                <TextField
                  autoFocus
                  name="username"
                  label="Username"
                  autoComplete="username"
                  helperText="Username should be 3-255 characters long"
                />
              </Grid>
              <Grid item sx={{ mb: 2 }}>
                <PasswordField
                  name="password"
                  label="Password"
                  helperText="Password should be 8-255 characters long"
                />
              </Grid>
              <Grid item sx={{ mb: 2 }}>
                <PasswordField name="password2" label="Confirm password" />
              </Grid>

              {errors.root?.serverError?.message ? (
                <Grid item>
                  <ErrorMessage message={errors.root.serverError.message} />
                </Grid>
              ) : null}

              <Grid container alignItems="flex-start" justifyContent="space-between">
                <LoadingButton loading={registerUser.isLoading} type="submit" variant="contained">
                  Register
                </LoadingButton>
                <Typography align="left" paragraph>
                  Already have an account?{' '}
                  <Link to="/login">
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'underline',
                      }}
                    >
                      Login
                    </Typography>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Container>
  );
}
