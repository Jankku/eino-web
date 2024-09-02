import { useReducer } from 'react';
import { Button, Card, CardContent, Grid } from '@mui/material';
import DeleteAccountDialog from './DeleteAccountDialog';
import ExportDialog from './ExportDialog';
import ShareDialog from './ShareDialog';
import Download from '@mui/icons-material/Download';
import Upload from '@mui/icons-material/Upload';
import ShareRounded from '@mui/icons-material/ShareRounded';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import ImportDialog from './ImportDialog';
import ChangeEmailDialog from './ChangeEmailDialog';
import Enable2FADialog from './Enable2FADialog';
import Disable2FADialog from './Disable2FADialog';
import { Link } from 'react-router-dom';

type AccountActionsProps = {
  email: string | null;
  emailVerifiedOn: string | null;
  totpEnabledOn: string | null;
};

export function AccountActions({ email, emailVerifiedOn, totpEnabledOn }: AccountActionsProps) {
  const [deleteAccountDialogOpen, toggleDeleteAccountDialog] = useReducer((open) => !open, false);
  const [shareDialogOpen, toggleShareDialog] = useReducer((open) => !open, false);
  const [exportDialogOpen, toggleExportDialog] = useReducer((open) => !open, false);
  const [importDialogOpen, toggleImportDialog] = useReducer((open) => !open, false);
  const [changeEmailDialogOpen, toggleChangeEmailDialog] = useReducer((open) => !open, false);
  const [enable2FADialogOpen, toggleEnable2FADialog] = useReducer((open) => !open, false);
  const [disable2FADialogOpen, toggleDisable2FADialog] = useReducer((open) => !open, false);

  return (
    <>
      <Card component="section" variant="outlined" sx={{ flexGrow: 1 }}>
        <CardContent sx={{ p: 0, pl: 2 }}>
          <h2>Account actions</h2>
          <Grid container spacing={2}>
            {totpEnabledOn ? (
              <Grid item>
                <Button
                  startIcon={<RemoveModeratorIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={toggleDisable2FADialog}
                >
                  Disable 2FA
                </Button>
              </Grid>
            ) : (
              <Grid item>
                <Button
                  startIcon={<ShieldOutlined />}
                  variant="contained"
                  color="primary"
                  onClick={toggleEnable2FADialog}
                >
                  Enable 2FA
                </Button>
              </Grid>
            )}
            <Grid item>
              {email && !emailVerifiedOn ? (
                <Button
                  component={Link}
                  to="verify-email"
                  state={{ email }}
                  startIcon={<AlternateEmailIcon />}
                  variant="contained"
                  color="primary"
                >
                  Verify email
                </Button>
              ) : (
                <Button
                  startIcon={<AlternateEmailIcon />}
                  variant="contained"
                  color="primary"
                  onClick={toggleChangeEmailDialog}
                >
                  {email ? 'Update' : 'Add'} email
                </Button>
              )}
            </Grid>
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
                startIcon={<Upload />}
                variant="contained"
                color="primary"
                onClick={toggleImportDialog}
              >
                Import
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

      <ImportDialog visible={importDialogOpen} closeDialog={toggleImportDialog} />

      <ShareDialog visible={shareDialogOpen} closeDialog={toggleShareDialog} />

      <ChangeEmailDialog
        email={email}
        visible={changeEmailDialogOpen}
        closeDialog={toggleChangeEmailDialog}
      />

      <Enable2FADialog visible={enable2FADialogOpen} closeDialog={toggleEnable2FADialog} />

      <Disable2FADialog visible={disable2FADialogOpen} closeDialog={toggleDisable2FADialog} />
    </>
  );
}
