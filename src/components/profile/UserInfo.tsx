import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';
import { Link } from 'react-router-dom';

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
    <Card component="section" variant="outlined" sx={{ flexGrow: 2, minWidth: '20rem' }}>
      <CardContent sx={{ p: 0, px: 2 }}>
        <h2>User</h2>
        <dl>
          <ProfileDetailItem title={'Username'} text={username} />
          {email ? (
            <ProfileDetailItem
              title={'Email'}
              text={
                <>
                  <span>{email}</span> (
                  {emailVerifiedOn ? (
                    'Verified'
                  ) : (
                    <Link to="verify-email" state={{ email }}>
                      Verify email
                    </Link>
                  )}
                  )
                </>
              }
              tooltip={
                emailVerifiedOn
                  ? `Email verified on ${DateTime.fromISO(emailVerifiedOn).toLocaleString()}`
                  : undefined
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
        </dl>
      </CardContent>
    </Card>
  );
}
