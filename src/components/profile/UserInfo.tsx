import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';

type UserInfoProps = {
  username: string;
  registrationDate: string;
};

export function UserInfo({ username, registrationDate }: UserInfoProps) {
  return (
    <Card component="section" aria-labelledby="test" variant="outlined" sx={{ flexGrow: 1 }}>
      <CardContent sx={{ p: 0, px: 2 }}>
        <h2>User</h2>
        <dl>
          <ProfileDetailItem title={'Username'} text={username} />
          <ProfileDetailItem
            title={'Registration date'}
            text={DateTime.fromISO(registrationDate).toLocaleString()}
          />
        </dl>
      </CardContent>
    </Card>
  );
}
