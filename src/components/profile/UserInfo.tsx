import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';

type UserInfoProps = {
  username: string;
  email: string | null;
  registrationDate: string;
  totpEnabledOn: string | null;
};

export function UserInfo({ username, email, registrationDate, totpEnabledOn }: UserInfoProps) {
  return (
    <Card component="section" variant="outlined" sx={{ flexGrow: 2, minWidth: '20rem' }}>
      <CardContent sx={{ p: 0, px: 2 }}>
        <h2>User</h2>
        <dl>
          <ProfileDetailItem title={'Username'} text={username} />
          {email ? <ProfileDetailItem title={'Email'} text={email} /> : undefined}
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
