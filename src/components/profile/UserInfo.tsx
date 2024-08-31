import { Box, Card, CardContent, Stack, Tooltip, Typography, Link as MUILink } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

type UserInfoProps = {
  username: string;
  email: string | null;
  emailVerifiedOn: string | null;
  registrationDate: string;
  totpEnabledOn: string | null;
};

export function UserInfo({
  username,
  email,
  emailVerifiedOn,
  registrationDate,
  totpEnabledOn,
}: UserInfoProps) {
  return (
    <Card component="section" variant="outlined" sx={{ flexGrow: 2, minWidth: { sm: '22rem' } }}>
      <CardContent sx={{ p: 0, px: 2, overflowWrap: 'anywhere' }}>
        <h2>User</h2>
        <Stack gap={1}>
          <ProfileDetailItem title={'Username'} text={username} />
          {email ? (
            <ProfileDetailItem
              title={'Email'}
              text={
                <>
                  {email}
                  <Tooltip
                    arrow
                    title={
                      <Typography variant="body2">
                        {emailVerifiedOn ? (
                          `Email verified on ${DateTime.fromISO(emailVerifiedOn).toLocaleString()}`
                        ) : (
                          <MUILink
                            component={Link}
                            to="verify-email"
                            state={{ email }}
                            color="#fff"
                            underline="hover"
                          >
                            Click to verify email
                          </MUILink>
                        )}
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
          <ProfileDetailItem
            title={'Registration date'}
            text={DateTime.fromISO(registrationDate).toLocaleString()}
          />
          {totpEnabledOn ? (
            <ProfileDetailItem
              title={'2FA activation date'}
              text={DateTime.fromISO(totpEnabledOn).toLocaleString()}
            />
          ) : undefined}
        </Stack>
      </CardContent>
    </Card>
  );
}
