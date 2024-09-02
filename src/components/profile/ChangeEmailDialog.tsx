import { Button, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { UpdateEmailBody, useUpdateEmail } from '../../data/profile/useUpdateEmail';
import TextField from '../form/TextField';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';
import { useState } from 'react';
import { useAuthContext } from '../../providers/AuthenticationProvider';

type UpdateEmailDialogProps = {
  email: string | null;
  visible: boolean;
  closeDialog: () => void;
};

export default function ChangeEmailDialog({ email, visible, closeDialog }: UpdateEmailDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const { is2FAEnabled } = useAuthContext();
  const [emailFormSchema] = useState(() =>
    z
      .object({
        email: zodFields.optionalEmail,
        twoFactorCode: zodFields.optionalOtp,
      })
      .refine((data) => is2FAEnabled && data.twoFactorCode, {
        path: ['twoFactorCode'],
        message: 'Two-factor code is required',
      }),
  );
  const formMethods = useForm({
    defaultValues: {
      email: '',
      twoFactorCode: '',
    },
    resolver: zodResolver(emailFormSchema),
  });
  const {
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = formMethods;
  const updateEmail = useUpdateEmail();

  const resetState = () => {
    resetForm({ email: '', twoFactorCode: '' });
    updateEmail.reset();
    closeDialog();
  };

  const onSubmit = (body: UpdateEmailBody) => {
    updateEmail.mutate(body, {
      onSuccess: () => {
        closeDialog();
        showSuccessSnackbar('Email updated successfully');
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
    <BaseDialog
      title={`${email ? 'Update' : 'Add'} email`}
      maxWidth="xs"
      open={visible}
      onClose={() => resetState()}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <Typography paragraph>
                Make sure to verify your new email address after updating it. Otherwise you cannot
                reset your password.
              </Typography>
              {email ? <Typography paragraph>Current email: {email}</Typography> : undefined}

              <TextField
                autoFocus
                type="email"
                name="email"
                label="New email"
                placeholder="john@example.com"
              />
              {is2FAEnabled ? (
                <TextField
                  name="twoFactorCode"
                  label="Enter your 2FA code"
                  autoComplete="one-time-code"
                />
              ) : undefined}
              {errors.root?.serverError?.message ? (
                <ErrorMessage message={errors.root.serverError.message} />
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => {
                resetState();
              }}
            >
              Cancel
            </Button>
            <LoadingButton loading={updateEmail.isPending} color="primary" type="submit">
              Update email
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
