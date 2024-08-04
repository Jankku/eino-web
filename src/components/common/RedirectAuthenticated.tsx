import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/AuthenticationProvider';

type RedirectAuthenticatedProps = {
  children: React.ReactNode;
};

export default function RedirectAuthenticated({ children }: RedirectAuthenticatedProps) {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? <Navigate replace to="/books" /> : children;
}
