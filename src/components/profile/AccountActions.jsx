import { useReducer } from 'react';
import { Button, Card, CardContent, Grid } from '@mui/material';
import DeleteAccountDialog from './DeleteAccountDialog';
import ExportDialog from './ExportDialog';
import ShareDialog from './ShareDialog';
import Download from '@mui/icons-material/Download';
import ShareRounded from '@mui/icons-material/ShareRounded';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

function AccountActions() {
  const [deleteAccountDialogOpen, toggleDeleteAccountDialog] = useReducer((open) => !open, false);
  const [shareDialogOpen, toggleShareDialog] = useReducer((open) => !open, false);
  const [exportDialogOpen, toggleExportDialog] = useReducer((open) => !open, false);

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
              <Button
                startIcon={<Download />}
                variant="contained"
                color="primary"
                onClick={toggleExportDialog}
              >
                Export
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<PersonRemoveIcon />}
                variant="contained"
                color="secondary"
                onClick={toggleDeleteAccountDialog}
              >
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

      <ExportDialog visible={exportDialogOpen} closeDialog={toggleExportDialog} />

      <ShareDialog visible={shareDialogOpen} closeDialog={toggleShareDialog} />
    </>
  );
}

export default AccountActions;
