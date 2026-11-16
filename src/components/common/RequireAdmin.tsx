import { Outlet } from 'react-router';
import { useToken } from '../../hooks/useToken';
import Error403 from '../errors/Error403';

export default function RequireAdmin() {
  const { role } = useToken();
  return role === 'admin' ? <Outlet /> : <Error403 />;
}
