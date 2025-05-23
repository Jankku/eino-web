import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '../../components/form/TextField';
import { parseError, zodFields } from '../../utils/zodUtil';
import { HTTPError } from 'ky';
import { z } from 'zod';
import { useForgotPassword } from '../../data/auth/useForgotPassword';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import Head from '../../components/common/Head';

const emailFormSchema = z.object({
  email: zodFields.email,
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(emailFormSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const forgotPassword = useForgotPassword();

  const onSubmit = async ({ email }: { email: string }) => {
    forgotPassword.mutate(email, {
      onSuccess: ({ message, is2FAEnabled }) => {
        navigate('/reset-password', { state: { email, is2FAEnabled } });
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
      <Head pageTitle="Forgot Password" />
      <Box sx={{ textAlign: 'center' }}>
        <h1>Find your account</h1>
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
              Enter the email associated with your account to change your password.
            </Typography>

            <Stack sx={{ gap: 1 }}>
              <TextField autoFocus name="email" type="email" label="Email" />
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </Stack>
            <Button
              loading={forgotPassword.isPending}
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
