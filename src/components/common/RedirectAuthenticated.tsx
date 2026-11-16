import { Navigate, Outlet } from 'react-router';
import { useToken } from '../../hooks/useToken';
import { useRedirect } from '../../hooks/useRedirect';

export default function RedirectAuthenticated() {
  const { isLoggedIn } = useToken();
  const redirectTo = useRedirect();
  return isLoggedIn ? <Navigate replace to={redirectTo} /> : <Outlet />;
}
