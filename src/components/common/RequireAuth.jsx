import useToken from '../../hooks/useToken';
import Error401 from '../errors/Error401';

export default function RequireAuth({ children }) {
  const { isRefreshTokenValid } = useToken();
  return isRefreshTokenValid() ? children : <Error401 />;
}
