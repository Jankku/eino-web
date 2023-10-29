import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';

export default function useToken() {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const username = localStorage.getItem('username');

  const setToken = (accessToken) => {
    try {
      const { username } = jwtDecode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
    } catch (err) {
      console.error(err);
    }
  };

  const setRefreshToken = (refreshToken) => {
    try {
      localStorage.setItem('refreshToken', refreshToken);
    } catch (err) {
      console.error(err);
    }
  };

  const isAccessTokenValid = () => {
    try {
      jwtDecode(token, { header: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const isRefreshTokenValid = () => {
    try {
      const decoded = jwtDecode(refreshToken);
      const expTime = DateTime.fromSeconds(decoded.exp);
      return expTime > DateTime.now();
    } catch (error) {
      return false;
    }
  };

  const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  };

  return {
    token,
    refreshToken,
    username,
    setToken,
    setRefreshToken,
    removeTokens,
    isAccessTokenValid,
    isRefreshTokenValid,
  };
}
