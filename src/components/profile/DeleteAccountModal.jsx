import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ProfileController from '../../data/ProfileController';
import BaseDialog from '../common/BaseDialog';

function DeleteAccountModal({ visible, closeDialog, submitAction }) {
  const [userPassword, setUserPassword] = useState('');
  const [formError, setFormError] = useState({ isError: false, text: '' });

  const clearFormError = () => setFormError({ isError: false, text: '' });

  const handleChange = (e) => {
    setUserPassword(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      await ProfileController.deleteAccount(userPassword);
      closeDialog();
      submitAction();
    } catch (err) {
      setFormError({ ...formError, isError: true, text: err.response.data.errors[0].message });
    }
  };

  return (
    <BaseDialog open={visible}>
      <DialogTitle>Delete account</DialogTitle>
      <form method="post" onSubmit={submitForm} encType="application/json">
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
          />
          <FormHelperText error>{formError.text}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Delete account
          </Button>
        </DialogActions>
      </form>
    </BaseDialog>
  );
}

export default DeleteAccountModal;
