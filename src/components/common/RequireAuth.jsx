import useToken from '../../utils/useToken';
import Error401 from '../errors/Error401';

export default function RequireAuth({ children }) {
  const { token } = useToken();
  return token ? children : <Error401 />;
}
