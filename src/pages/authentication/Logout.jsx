import useToken from '../../utils/useToken';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../utils/auth';

export default function Logout() {
  const { removeTokens } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  setIsLoggedIn(false);
  removeTokens();
  return <Navigate to={'/'} replace />;
}
