import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';

type UserInfoProps = {
  username: string;
  email: string | null;
  registrationDate: string;
};

export function UserInfo({ username, email, registrationDate }: UserInfoProps) {
  return (
    <Card component="section" variant="outlined" sx={{ flexGrow: 2, minWidth: '20rem' }}>
      <CardContent sx={{ p: 0, px: 2 }}>
        <h2>User</h2>
        <dl>
          <ProfileDetailItem title={'Username'} text={username} />
          <ProfileDetailItem title={'Email'} text={email} />
          <ProfileDetailItem
            title={'Registration date'}
            text={DateTime.fromISO(registrationDate).toLocaleString()}
          />
        </dl>
      </CardContent>
    </Card>
  );
}
