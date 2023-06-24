import { Button, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseDialog from '../common/BaseDialog';
import { useDeleteAccount } from '../../data/profile/useDeleteAccount';
import { LoadingButton } from '@mui/lab';
import PasswordField from '../form/PasswordField';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zodFields } from '../../utils/zodUtil';

const passwordFormSchema = z.object({
  password: zodFields.password,
});

function DeleteAccountDialog({ visible, closeDialog }) {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(passwordFormSchema),
  });
  const { handleSubmit, setError, reset: resetForm } = formMethods;
  const deleteAccount = useDeleteAccount();

  const resetState = () => {
    resetForm();
    deleteAccount.reset();
    closeDialog();
  };

  const onSubmit = ({ password }) => {
    deleteAccount.mutate(password, {
      onSuccess: () => {
        closeDialog();
        navigate('/logout');
      },
      onError: (error) => {
        setError('password', {
          message: error?.response?.data?.errors[0]?.message,
        });
      },
    });
  };

  return (
    <BaseDialog open={visible} onClose={() => resetState()}>
      <DialogTitle>Delete account</DialogTitle>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography paragraph fontWeight={700} color="error">
              NOTE: THIS ACTION IS IRREVERSIBLE!
            </Typography>
            <Typography paragraph variant="body1">
              This action will permanently delete your account and all associated data. Please
              confirm your password before proceeding.
            </Typography>
            <PasswordField autoFocus name="password" label="Confirm password" />
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
            <LoadingButton loading={deleteAccount.isLoading} color="primary" type="submit">
              Delete account
            </LoadingButton>
          </DialogActions>
        </form>
      </FormProvider>
    </BaseDialog>
  );
}

export default DeleteAccountDialog;
