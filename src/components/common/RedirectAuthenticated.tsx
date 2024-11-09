import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useRedirect } from '../../hooks/useRedirect';

type RedirectAuthenticatedProps = {
  children: React.ReactNode;
};

export default function RedirectAuthenticated({ children }: RedirectAuthenticatedProps) {
  const { isLoggedIn } = useAuthContext();
  const redirectTo = useRedirect();
  return isLoggedIn ? <Navigate replace to={redirectTo} /> : children;
}
