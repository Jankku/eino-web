import useToken from '../utils/useToken';
import { useHistory } from 'react-router';
import axios from './axios';

export default async function FetchNewRefreshToken(err) {
  const { refreshToken, setToken, removeToken, removeRefreshToken } =
    useToken();
  const history = useHistory();

  const { name, message } = err.response.data.errors[0];
  const { status } = err.response;

  if (
    status === 401 &&
    name === 'authorization_error' &&
    message === 'jwt expired'
  ) {
    try {
      const res = await axios({
        method: 'post',
        url: `/api/auth/refreshtoken`,
        data: { refreshToken },
      });

      setToken(res.data.accessToken);
      history.go(0);
    } catch (err) {
      removeToken();
      removeRefreshToken();
      history.replace('/');
    }
  }
}
