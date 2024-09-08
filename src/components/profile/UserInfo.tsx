import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoIcon from '@mui/icons-material/Info';

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
      <CardContent sx={{ py: 0, px: 2, overflowWrap: 'anywhere' }}>
        <h2>User</h2>
        <Stack gap={2}>
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
  );
}
