import { Outlet } from 'react-router';
import { useToken } from '../../hooks/useToken';
import Error401 from '../errors/Error401';

export default function RequireAuth() {
  const { isLoggedIn } = useToken();
  return isLoggedIn ? <Outlet /> : <Error401 />;
}
