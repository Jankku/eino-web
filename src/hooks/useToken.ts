import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

type DecodedToken = {
  userId: string;
  username: string;
  role: 'admin' | 'basic' | 'demo';
  is2FAEnabled: boolean;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const getAccessTokenFromLocalStorage = () => localStorage.getItem(ACCESS_TOKEN_KEY) as string;

const getRefreshTokenFromLocalStorage = () => localStorage.getItem(REFRESH_TOKEN_KEY) as string;

const isAccessTokenValid = (token: string) => {
  try {
    jwtDecode(token, { header: true });
    return true;
  } catch {
    return false;
  }
};

const isRefreshTokenValid = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp) return DateTime.fromSeconds(decoded.exp) > DateTime.now();
    return false;
  } catch {
    return false;
  }
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
};

export function useToken() {
  const token = useSyncExternalStore(subscribe, getAccessTokenFromLocalStorage);
  const refreshToken = useSyncExternalStore(subscribe, getRefreshTokenFromLocalStorage);

  const decodedToken = useMemo(() => (token ? (jwtDecode(token) as DecodedToken) : null), [token]);

  const username = decodedToken?.username || '';
  const role = decodedToken?.role;
  const is2FAEnabled = decodedToken?.is2FAEnabled || false;
  const isLoggedIn = useMemo(
    () => isAccessTokenValid(token) && isRefreshTokenValid(refreshToken),
    [token, refreshToken],
  );

  const setToken = useCallback((accessToken: string) => {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setRefreshToken = useCallback((refreshToken: string) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const removeTokens = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event('storage'));
  }, []);

  return {
    token,
    refreshToken,
    username,
    role,
    isLoggedIn,
    is2FAEnabled,
    setToken,
    setRefreshToken,
    removeTokens,
  };
}
