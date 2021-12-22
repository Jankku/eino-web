import useToken from '../../utils/useToken';
import { Navigate } from 'react-router-dom';

export default function Logout() {
  const { removeToken, removeRefreshToken } = useToken();
  removeToken();
  removeRefreshToken();

  return <Navigate to={'/'} replace />;
}
