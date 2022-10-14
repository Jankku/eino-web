import { Button, Card, CardContent } from '@mui/material';
import { useState } from 'react';
import DeleteAccountModal from './DeleteAccountModal';

function AccountActions() {
  const [deleteAccountDialogVisible, setDeleteAccountDialogVisible] = useState(false);

  const handleDeleteAccountDialogOpen = () => setDeleteAccountDialogVisible(true);
  const handleDeleteAccountDialogCancel = () => setDeleteAccountDialogVisible(false);

  return (
    <>
      <Card variant="outlined" sx={{ flexGrow: 1 }}>
        <CardContent sx={{ p: 0, pl: 2 }}>
          <h2>Account actions</h2>
          <Button variant="contained" color="secondary" onClick={handleDeleteAccountDialogOpen}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountModal
        visible={deleteAccountDialogVisible}
        closeDialog={handleDeleteAccountDialogCancel}
      />
    </>
  );
}

export default AccountActions;
