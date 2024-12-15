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
import { Link } from 'react-router';
import { useToggle } from '@uidotdev/usehooks';

type AccountActionsProps = {
  email: string | null;
  emailVerifiedOn: string | null;
  totpEnabledOn: string | null;
};

export function AccountActions({ email, emailVerifiedOn, totpEnabledOn }: AccountActionsProps) {
  const [deleteAccountDialogOpen, toggleDeleteAccountDialog] = useToggle(false);
  const [shareDialogOpen, toggleShareDialog] = useToggle(false);
  const [exportDialogOpen, toggleExportDialog] = useToggle(false);
  const [importDialogOpen, toggleImportDialog] = useToggle(false);
  const [changeEmailDialogOpen, toggleChangeEmailDialog] = useToggle(false);
  const [enable2FADialogOpen, toggleEnable2FADialog] = useToggle(false);
  const [disable2FADialogOpen, toggleDisable2FADialog] = useToggle(false);

  return (
    <>
      <Card component="section" variant="outlined" sx={{ flexGrow: 1 }}>
        <CardContent sx={{ p: 0, px: 2 }}>
          <h2>Actions</h2>
          <Grid container gap={2}>
            {totpEnabledOn ? (
              <Grid item p={0}>
                <Button
                  startIcon={<RemoveModeratorIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={toggleDisable2FADialog as () => void}
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
                  onClick={toggleEnable2FADialog as () => void}
                >
                  Enable 2FA
                </Button>
              </Grid>
            )}

            {email ? (
              <>
                {!emailVerifiedOn ? (
                  <Grid item>
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
                  </Grid>
                ) : undefined}
                <Grid item>
                  <Button
                    startIcon={<AlternateEmailIcon />}
                    variant="contained"
                    color="primary"
                    onClick={toggleChangeEmailDialog as () => void}
                  >
                    Update email
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item>
                <Button
                  startIcon={<AlternateEmailIcon />}
                  variant="contained"
                  color="primary"
                  onClick={toggleChangeEmailDialog as () => void}
                >
                  Add email
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                startIcon={<ShareRounded />}
                variant="contained"
                color="primary"
                onClick={toggleShareDialog as () => void}
              >
                Share
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<Download />}
                variant="contained"
                color="primary"
                onClick={toggleExportDialog as () => void}
              >
                Export
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<Upload />}
                variant="contained"
                color="primary"
                onClick={toggleImportDialog as () => void}
              >
                Import
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<PersonRemoveIcon />}
                variant="contained"
                color="secondary"
                onClick={toggleDeleteAccountDialog as () => void}
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
