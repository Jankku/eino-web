import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import BaseDialog from '../common/BaseDialog';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseError, zodFields } from '../../utils/zodUtil';
import ErrorMessage from '../authentication/ErrorMessage';
import { HTTPError } from 'ky';
import { useUpdateEmail } from '../../data/profile/useUpdateEmail';
import TextField from '../form/TextField';
import { useCustomSnackbar } from '../../hooks/useCustomSnackbar';

const emailFormSchema = z.object({
  email: zodFields.optionalEmail,
});

type UpdateEmailDialogProps = {
  email: string | null;
  visible: boolean;
  closeDialog: () => void;
};

export default function UpdateEmailDialog({ email, visible, closeDialog }: UpdateEmailDialogProps) {
  const { showSuccessSnackbar } = useCustomSnackbar();
  const formMethods = useForm({
    defaultValues: {
      email: '',
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
    resetForm();
    updateEmail.reset();
    closeDialog();
  };

  const onSubmit = ({ email }: { email: string | null }) => {
    updateEmail.mutate(email, {
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
    <BaseDialog title="Update email" maxWidth="xs" open={visible} onClose={() => resetState()}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography paragraph mb={1}>
              Make sure to verify your new email address after updating it. Otherwise you cannot
              reset your password.
            </Typography>
            <Typography paragraph mb={3}>
              Current email: {email}
            </Typography>
            <TextField
              autoFocus
              type="email"
              name="email"
              label="New email"
              placeholder="john@example.com"
            />
            {errors.root?.serverError?.message ? (
              <ErrorMessage message={errors.root.serverError.message} />
            ) : null}
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
