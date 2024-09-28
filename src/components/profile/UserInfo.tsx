import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { getProfilePictureUrl } from '../../utils/profileUtil';
import { useReducer } from 'react';
import ProfilePictureDialog from './ProfilePictureDialog';

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
  const [editProfilePictureDialogOpen, toggleEditProfilePictureDialog] = useReducer(
    (open) => !open,
    false,
  );
  return (
    <>
      <Card component="section" variant="outlined" sx={{ flexGrow: 2, minWidth: { sm: '22rem' } }}>
        <CardContent sx={{ overflowWrap: 'anywhere' }}>
          <Stack
            sx={{
              gap: 2,
            }}
          >
            <Tooltip
              arrow
              title={<Typography variant="body2">Click to edit your profile picture</Typography>}
              enterTouchDelay={500}
            >
              <ButtonBase
                aria-label="Edit profile picture"
                sx={{ width: 'fit-content' }}
                onClick={toggleEditProfilePictureDialog}
              >
                <Avatar
                  src={getProfilePictureUrl(profilePicturePath)}
                  alt="Profile picture"
                  sx={(theme) => ({
                    width: 96,
                    height: 96,
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
            <ProfileDetailItem
              title={'Username'}
              text={
                <>
                  {username}
                  <Tooltip
                    arrow
                    enterTouchDelay={500}
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
            />
            {email ? (
              <ProfileDetailItem
                title={'Email'}
                text={
                  <>
                    {email}
                    <Tooltip
                      enterTouchDelay={500}
                      arrow
                      title={
                        <Typography variant="body2">
                          {emailVerifiedOn
                            ? `Email verified on ${DateTime.fromISO(emailVerifiedOn).toLocaleString()}`
                            : 'Email unverified. Please verify your email.'}
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
                        sx={{ paddingLeft: '4px', display: 'flex', alignContent: 'center' }}
                      >
                        {emailVerifiedOn ? (
                          <CheckCircleIcon
                            role="presentation"
                            color="success"
                            fontSize="small"
                            sx={{ alignSelf: 'center' }}
                          />
                        ) : (
                          <CancelOutlinedIcon
                            role="presentation"
                            color="error"
                            fontSize="small"
                            sx={{ alignSelf: 'center' }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </>
                }
              />
            ) : undefined}
            {totpEnabledOn ? (
              <ProfileDetailItem
                title={'Two-factor authentication'}
                text={`Enabled since ${DateTime.fromISO(totpEnabledOn).toLocaleString()}`}
              />
            ) : undefined}
          </Stack>
        </CardContent>
      </Card>
      <ProfilePictureDialog
        visible={editProfilePictureDialogOpen}
        profilePictureUrl={getProfilePictureUrl(profilePicturePath)}
        onClose={toggleEditProfilePictureDialog}
      />
    </>
  );
}
