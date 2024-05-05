import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import { ProfileDetailItem } from './ProfileDetailItem';

export function UserInfo({ data }) {
  return (
    <Card component="section" aria-labelledby="test" variant="outlined" sx={{ flexGrow: 1 }}>
      <CardContent sx={{ p: 0, px: 2 }}>
        <h2>User</h2>
        <dl>
          <ProfileDetailItem title={'Username'} text={data.username} />
          <ProfileDetailItem
            title={'Registration date'}
            text={DateTime.fromISO(data.registration_date).toLocaleString()}
          />
        </dl>
      </CardContent>
    </Card>
  );
}
