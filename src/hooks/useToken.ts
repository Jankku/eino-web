import { jwtDecode } from 'jwt-decode';
import { useSyncExternalStore } from 'react';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken as storeRefreshToken,
} from '../utils/tokenStorage';

type DecodedToken = {
  userId: string;
  username: string;
  role: 'admin' | 'basic' | 'demo';
  is2FAEnabled: boolean;
};

const getAccessTokenFromLocalStorage = () => getAccessToken() as string;

const getRefreshTokenFromLocalStorage = () => getRefreshToken() as string;

const decodeAccessToken = (token: string | null): DecodedToken | null => {
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

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
    if (decoded.exp) return decoded.exp * 1000 > Date.now();
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

const setToken = (accessToken: string) => {
  try {
    setAccessToken(accessToken);
  } catch (error) {
    console.error(error);
  }
};

const setRefreshToken = (refreshToken: string) => {
  try {
    storeRefreshToken(refreshToken);
  } catch (error) {
    console.error(error);
  }
};

export function useToken() {
  const token = useSyncExternalStore(subscribe, getAccessTokenFromLocalStorage);
  const refreshToken = useSyncExternalStore(subscribe, getRefreshTokenFromLocalStorage);

  const decodedToken = decodeAccessToken(token);

  const username = decodedToken?.username || '';
  const role = decodedToken?.role;
  const is2FAEnabled = decodedToken?.is2FAEnabled || false;
  const isLoggedIn = isAccessTokenValid(token) && isRefreshTokenValid(refreshToken);

  return {
    token,
    refreshToken,
    username,
    role,
    isLoggedIn,
    is2FAEnabled,
    setToken,
    setRefreshToken,
    removeTokens: clearTokens,
  };
}
