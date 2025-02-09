import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import InfoIcon from '@mui/icons-material/Info';
import { getProfilePictureUrl } from '../../utils/profileUtil';
import { useToggle } from '@uidotdev/usehooks';
import ProfilePictureDialog from './ProfilePictureDialog';
import ChangeEmailDialog from './ChangeEmailDialog';
import Enable2FADialog from './Enable2FADialog';
import Disable2FADialog from './Disable2FADialog';
import ImportDialog from './ImportDialog';
import ExportDialog from './ExportDialog';
import DeleteAccountDialog from './DeleteAccountDialog';
import ShareDialog from './ShareDialog';
import StatusTooltip from './StatusTooltip';

type UserInfoProps = {
  username: string;
  email: string | null;
  emailVerifiedOn: string | null;
  totpEnabledOn: string | null;
  profilePicturePath: string | null;
  registrationDate: string;
};

export function UserInfo({
  username,
  email,
  emailVerifiedOn,
  totpEnabledOn,
  profilePicturePath,
  registrationDate,
}: UserInfoProps) {
  const [editProfilePictureDialogOpen, toggleEditProfilePictureDialog] = useToggle(false);
  const [changeEmailDialogOpen, toggleChangeEmailDialog] = useToggle(false);
  const [enable2FADialogOpen, toggleEnable2FADialog] = useToggle(false);
  const [disable2FADialogOpen, toggleDisable2FADialog] = useToggle(false);
  const [exportDialogOpen, toggleExportDialog] = useToggle(false);
  const [importDialogOpen, toggleImportDialog] = useToggle(false);
  const [deleteAccountDialogOpen, toggleDeleteAccountDialog] = useToggle(false);
  const [shareDialogOpen, toggleShareDialog] = useToggle(false);

  return (
    <>
      <Card component="section" variant="outlined">
        <CardContent sx={{ overflowWrap: 'anywhere' }}>
          <Stack gap={{ xs: 4, sm: 3 }}>
            <Grid
              container
              direction={{ xs: 'column', sm: 'row' }}
              rowGap={1}
              justifyContent="space-between"
              alignItems={{ xs: 'center', sm: 'flex-start' }}
            >
              <Tooltip
                arrow
                title={<Typography variant="body2">Click to edit your profile picture</Typography>}
                enterTouchDelay={500}
              >
                <ButtonBase
                  aria-label="Edit profile picture"
                  sx={{ width: 'fit-content' }}
                  onClick={toggleEditProfilePictureDialog as () => void}
                >
                  <Avatar
                    src={getProfilePictureUrl(profilePicturePath)}
                    alt="Profile picture"
                    sx={(theme) => ({
                      width: { xs: 128, sm: 110 },
                      height: { xs: 128, sm: 110 },
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.grey[500],
                      ...theme.applyStyles('dark', {
                        backgroundColor: theme.palette.grey[800],
                        color: theme.palette.grey[600],
                      }),
                    })}
                  ></Avatar>
                </ButtonBase>
              </Tooltip>
              <Button
                startIcon={<ShareRoundedIcon />}
                variant="text"
                color="primary"
                onClick={toggleShareDialog as () => void}
              >
                Share profile
              </Button>
            </Grid>
            <ProfileDetailItem
              title={'Username'}
              text={
                <>
                  {username}
                  <Tooltip
                    arrow
                    enterTouchDelay={500}
                    leaveTouchDelay={3000}
                    title={
                      <Typography variant="body2">
                        Account registered on {DateTime.fromISO(registrationDate).toLocaleString()}
                      </Typography>
                    }
                    placement="top-start"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -10],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={(theme) => ({
                        paddingLeft: '4px',
                        color: theme.palette.info.main,
                        display: 'flex',
                        alignContent: 'center',
                      })}
                    >
                      <InfoIcon role="presentation" fontSize="small" sx={{ alignSelf: 'center' }} />
                    </Box>
                  </Tooltip>
                </>
              }
              actions={
                <Button
                  startIcon={<PersonRemoveIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={toggleDeleteAccountDialog as () => void}
                >
                  Delete account
                </Button>
              }
            />
            <ProfileDetailItem
              title={'Email'}
              text={
                <>
                  {email ?? 'No email address'}
                  <StatusTooltip
                    state={email ? (emailVerifiedOn ? 'enabled' : 'disabled') : 'unset'}
                    enabledTitle={`Email verified on ${emailVerifiedOn ? DateTime.fromISO(emailVerifiedOn).toLocaleString() : ''}`}
                    disabledTitle="Email unverified. Please verify your email"
                    unsetTitle="Please add an email address. It is used to reset your password in case you forget it"
                  ></StatusTooltip>
                </>
              }
              actions={
                email ? (
                  <Stack direction="row" gap={1} alignItems="center">
                    {!emailVerifiedOn ? (
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
                    ) : undefined}
                    <Button
                      startIcon={<AlternateEmailIcon />}
                      variant="contained"
                      color="primary"
                      onClick={toggleChangeEmailDialog as () => void}
                    >
                      Update email
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    startIcon={<AlternateEmailIcon />}
                    variant="contained"
                    color="primary"
                    onClick={toggleChangeEmailDialog as () => void}
                  >
                    Add email
                  </Button>
                )
              }
            />
            <ProfileDetailItem
              title={'Two-factor authentication'}
              text={
                <>
                  {totpEnabledOn
                    ? `Enabled since ${DateTime.fromISO(totpEnabledOn).toLocaleString()}`
                    : 'Disabled'}
                  <StatusTooltip
                    state={totpEnabledOn ? 'enabled' : 'disabled'}
                    enabledTitle="Two-factor authentication is enabled!"
                    disabledTitle="Please enable two-factor authentication to secure your account"
                  ></StatusTooltip>
                </>
              }
              actions={
                totpEnabledOn ? (
                  <Button
                    startIcon={<RemoveModeratorIcon />}
                    variant="contained"
                    color="secondary"
                    onClick={toggleDisable2FADialog as () => void}
                  >
                    Disable 2FA
                  </Button>
                ) : (
                  <Button
                    startIcon={<ShieldOutlinedIcon />}
                    variant="contained"
                    color="primary"
                    onClick={toggleEnable2FADialog as () => void}
                  >
                    Enable 2FA
                  </Button>
                )
              }
            />
            <ProfileDetailItem
              title={'Manage account data'}
              text={'Export or import your data'}
              actions={
                <Grid container gap={1}>
                  <Button
                    startIcon={<DownloadIcon />}
                    variant="contained"
                    color="primary"
                    onClick={toggleExportDialog as () => void}
                  >
                    Export
                  </Button>
                  <Button
                    startIcon={<UploadIcon />}
                    variant="contained"
                    color="primary"
                    onClick={toggleImportDialog as () => void}
                  >
                    Import
                  </Button>
                </Grid>
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {editProfilePictureDialogOpen ? (
        <ProfilePictureDialog
          visible={editProfilePictureDialogOpen}
          profilePictureUrl={getProfilePictureUrl(profilePicturePath)}
          onClose={toggleEditProfilePictureDialog}
        />
      ) : undefined}

      {changeEmailDialogOpen ? (
        <ChangeEmailDialog
          email={email}
          visible={changeEmailDialogOpen}
          closeDialog={toggleChangeEmailDialog}
        />
      ) : undefined}

      {shareDialogOpen ? (
        <ShareDialog visible={shareDialogOpen} closeDialog={toggleShareDialog} />
      ) : undefined}

      {enable2FADialogOpen ? (
        <Enable2FADialog visible={enable2FADialogOpen} closeDialog={toggleEnable2FADialog} />
      ) : undefined}

      {disable2FADialogOpen ? (
        <Disable2FADialog visible={disable2FADialogOpen} closeDialog={toggleDisable2FADialog} />
      ) : undefined}

      {exportDialogOpen ? (
        <ExportDialog visible={exportDialogOpen} closeDialog={toggleExportDialog} />
      ) : undefined}

      {importDialogOpen ? (
        <ImportDialog visible={importDialogOpen} closeDialog={toggleImportDialog} />
      ) : undefined}

      {deleteAccountDialogOpen ? (
        <DeleteAccountDialog
          visible={deleteAccountDialogOpen}
          closeDialog={toggleDeleteAccountDialog}
        />
      ) : undefined}
    </>
  );
}
