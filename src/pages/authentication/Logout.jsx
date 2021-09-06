import { Redirect } from 'react-router';
import useToken from '../../utils/useToken';

export default function Logout() {
  const { removeToken, removeRefreshToken } = useToken();

  removeToken();
  removeRefreshToken();

  return <Redirect to="/" />;
}
