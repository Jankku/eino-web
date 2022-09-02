import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import ProfileDetailItem from './ProfileDetailItem';

function UserInfo({ data }) {
  return (
    <Card variant="outlined" sx={{ flexGrow: 1 }}>
      <CardContent sx={{ p: 0, pl: 2 }}>
        <h2>User</h2>
        <ProfileDetailItem title={'Username'} text={data.username} />
        <ProfileDetailItem
          title={'Registration date'}
          text={DateTime.fromISO(data.registration_date).toLocaleString()}
        />
      </CardContent>
    </Card>
  );
}

export default UserInfo;
