import { Redirect } from 'react-router-dom';
import useToken from '../utils/useToken';

export default function PrivateRoute({ comp: Component, ...rest }) {
  const { token } = useToken();
  return token ? <Component {...rest} /> : <Redirect to="/login" />;
}
