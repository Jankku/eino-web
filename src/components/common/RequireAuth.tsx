import { useToken } from '../../hooks/useToken';
import Error401 from '../errors/Error401';

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isLoggedIn } = useToken();
  return isLoggedIn ? children : <Error401 />;
}
