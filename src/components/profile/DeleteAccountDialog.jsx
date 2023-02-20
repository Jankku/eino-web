import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDialog from '../common/BaseDialog';
import { useDeleteAccount } from '../../data/profile/useDeleteAccount';

const initialFormErrorState = { isError: false, text: ' ' };

function DeleteAccountDialog({ visible, closeDialog }) {
  const navigate = useNavigate();
  const [userPassword, setUserPassword] = useState('');
  const [formError, setFormError] = useState(initialFormErrorState);
  const deleteAccount = useDeleteAccount();

  const clearFormError = () => setFormError(initialFormErrorState);

  const handleChange = (e) => {
    setUserPassword(e.target.value);
  };

  return (
    <BaseDialog open={visible} onClose={() => closeDialog()}>
      <DialogTitle>Delete account</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          deleteAccount.mutate(userPassword, {
            onSuccess: () => {
              closeDialog();
              navigate('/logout');
            },
            onError: (err) => {
              setFormError({
                isError: true,
                text: err.response.data.errors[0].message,
              });
            },
          });
        }}
      >
        <DialogContent sx={{ pt: 0 }}>
          <Typography paragraph fontWeight={700} color="error">
            NOTE: THIS ACTION IS IRREVERSIBLE!
          </Typography>
          <Typography paragraph variant="body1">
            This action will permanently delete your account and all associated data. Please confirm
            your password before proceeding.
          </Typography>
          <TextField
            autoFocus
            required
            fullWidth
            name="password"
            type="password"
            autoComplete="current-password"
            margin="none"
            label="Confirm password"
            onFocus={clearFormError}
            value={userPassword}
            onChange={handleChange}
            disabled={deleteAccount.isLoading}
          />
          {deleteAccount.isError ? (
            <FormHelperText error sx={{ fontSize: 14 }}>
              {formError.text}
            </FormHelperText>
          ) : null}
          <LinearProgress sx={{ display: deleteAccount.isLoading ? 'block' : 'none' }} />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              closeDialog();
            }}
          >
            Cancel
          </Button>
          <Button color="primary" disabled={deleteAccount.isLoading} type="submit">
            Delete account
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}

export default DeleteAccountDialog;
