import { Box, Container, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVerifyEmail } from '../data/email/useVerifyEmail';
import ErrorMessage from '../components/authentication/ErrorMessage';
import { parseError } from '../utils/zodUtil';
import TextField from '../components/form/TextField';

function isNumeric(str) {
  return /^\d+$/.test(str);
}

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'OTP must be a 6-digit number' })
    .refine((val) => isNumeric(val), {
      message: 'OTP must be a 6-digit number',
    }),
});

export default function VerifyEmail() {
  const formMethods = useForm({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(otpSchema),
  });
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = formMethods;
  const verifyEmail = useVerifyEmail();

  const onSubmit = async (otp) => {
    verifyEmail.mutate(otp, {
      onSuccess: (data) => {},
      onError: async (error) => {
        const errors = await parseError(error);
        setError('root.serverError', {
          message: errors[0].message,
        });
      },
    });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4} alignItems="start">
            <Typography variant="h6">Input the 6-digit code that was sent to your email</Typography>
            <Stack spacing={1} pb={2}>
              <TextField
                fullWidth={false}
                autoFocus
                name="otp"
                label="OTP code"
                autoComplete="one-time-code"
              />
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </Stack>
          </Stack>
          <LoadingButton
            loading={verifyEmail.isPending}
            type="submit"
            variant="contained"
            color="primary"
          >
            Verify
          </LoadingButton>
        </form>
      </FormProvider>
    </Container>
  );
}
