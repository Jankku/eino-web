import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/AuthenticationProvider';

export default function RedirectAuthenticated({ children }) {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? <Navigate replace to="/books" /> : children;
}
