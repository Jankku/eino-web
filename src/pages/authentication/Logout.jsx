import useToken from '../../hooks/useToken';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useQueryClient } from '@tanstack/react-query';

export default function Logout() {
  const { removeTokens } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  const queryClient = useQueryClient();

  setIsLoggedIn(false);
  removeTokens();
  queryClient.clear();

  return <Navigate to={'/'} replace />;
}
