import { Card, CardContent } from '@mui/material';
import { DateTime } from 'luxon';
import ProfileDetailItem from './ProfileDetailItem';

function UserInfo({ data }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <ProfileDetailItem title={'username'} text={data.username} />
        <ProfileDetailItem
          title={'Registration date'}
          text={DateTime.fromISO(data.registration_date).toLocaleString()}
        />
      </CardContent>
    </Card>
  );
}

export default UserInfo;
