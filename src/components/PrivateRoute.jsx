import useToken from '../utils/useToken';
import Error401 from './errors/Error401';

export default function PrivateRoute({ comp: Component, ...rest }) {
  const { token } = useToken();
  return token ? <Component {...rest} /> : <Error401 />;
}
