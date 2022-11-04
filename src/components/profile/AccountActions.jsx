import { ShareRounded } from '@mui/icons-material';
import { Button, Card, CardContent, Grid } from '@mui/material';
import { useReducer } from 'react';
import DeleteAccountDialog from './DeleteAccountDialog';
import ShareDialog from './ShareDialog';

function AccountActions() {
  const [deleteAccountDialogOpen, toggleDeleteAccountDialog] = useReducer((open) => !open, false);
  const [shareDialogOpen, toggleShareDialog] = useReducer((open) => !open, false);

  return (
    <>
      <Card variant="outlined" sx={{ flexGrow: 1 }}>
        <CardContent sx={{ p: 0, pl: 2 }}>
          <h2>Account actions</h2>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                startIcon={<ShareRounded />}
                variant="contained"
                color="primary"
                onClick={toggleShareDialog}
              >
                Share
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={toggleDeleteAccountDialog}>
                Delete account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        visible={deleteAccountDialogOpen}
        closeDialog={toggleDeleteAccountDialog}
      />

      {shareDialogOpen ? (
        <ShareDialog visible={shareDialogOpen} closeDialog={toggleShareDialog} />
      ) : null}
    </>
  );
}

export default AccountActions;
