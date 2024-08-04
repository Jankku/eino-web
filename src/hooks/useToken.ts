import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';

export function useToken() {
  const token = localStorage.getItem('accessToken') as string;
  const refreshToken = localStorage.getItem('refreshToken') as string;
  const username = localStorage.getItem('username') as string;

  const setToken = (accessToken: string) => {
    try {
      const tokenUsername = (jwtDecode(accessToken) as { username: string }).username;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', tokenUsername);
    } catch (err) {
      console.error(err);
    }
  };

  const setRefreshToken = (refreshToken: string) => {
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
    } catch {
      return false;
    }
  };

  const isRefreshTokenValid = () => {
    try {
      const decoded = jwtDecode(refreshToken);
      const expTime = DateTime.fromSeconds(decoded.exp!);
      return expTime > DateTime.now();
    } catch {
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
