import jwt_decode from 'jwt-decode';
import { DateTime } from 'luxon';

export default function useToken() {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const getUsername = () => localStorage.getItem('username');

  const saveToken = (accessToken) => {
    try {
      const { username } = jwt_decode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
    } catch (err) {
      console.error(err);
    }
  };

  const saveRefreshToken = (refreshToken) => {
    try {
      localStorage.setItem('refreshToken', refreshToken);
    } catch (err) {
      console.error(err);
    }
  };

  const isAccessTokenValid = () => {
    try {
      jwt_decode(token, { header: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const isRefreshTokenValid = () => {
    try {
      const decoded = jwt_decode(refreshToken);
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
    setToken: saveToken,
    setRefreshToken: saveRefreshToken,
    removeTokens,
    getUsername,
    isAccessTokenValid,
    isRefreshTokenValid,
  };
}
