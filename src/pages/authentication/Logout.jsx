import useToken from '../../hooks/useToken';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/AuthenticationProvider';

export default function Logout() {
  const { removeTokens } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  setIsLoggedIn(false);
  removeTokens();
  return <Navigate to={'/'} replace />;
}
