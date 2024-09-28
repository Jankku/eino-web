import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';

type DecodedToken = {
  userId: string;
  username: string;
  role: 'admin' | 'basic' | 'demo';
  email: string | null;
  is2FAEnabled: boolean;
};

export function useToken() {
  const token = localStorage.getItem('accessToken') as string;
  const refreshToken = localStorage.getItem('refreshToken') as string;

  const getUsername = () => {
    if (!token) return '';
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.username || '';
  };

  const getEmail = () => {
    if (!token) return null;
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.email;
  };

  const getRole = () => {
    if (!token) return null;
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.role;
  };

  const getIs2FAEnabled = () => {
    if (!token) return false;
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.is2FAEnabled;
  };

  const setToken = (accessToken: string) => {
    try {
      localStorage.setItem('accessToken', accessToken);
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
      if (decoded.exp) {
        const expTime = DateTime.fromSeconds(decoded.exp);
        return expTime > DateTime.now();
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return {
    token,
    refreshToken,
    getUsername,
    getEmail,
    getRole,
    getIs2FAEnabled,
    setToken,
    setRefreshToken,
    isAccessTokenValid,
    isRefreshTokenValid,
    removeTokens,
  };
}
