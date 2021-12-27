import { treeItemClasses } from '@mui/lab';
import jwt_decode from 'jwt-decode';
import { useState } from 'react';

export default function useToken() {
  const [token] = useState(localStorage.getItem('accessToken'));
  const [refreshToken] = useState(localStorage.getItem('refreshToken'));

  const saveToken = (accessToken) => {
    try {
      const { userId, username } = jwt_decode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user_id', userId);
      localStorage.setItem('username', username);
    } catch (err) {
      console.error(err);
    }
  };

  const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
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
      const decoded = jwt_decode(token, { header: true });
      if (decoded) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const getUsername = () => localStorage.getItem('username');

  return {
    token,
    refreshToken,
    setToken: saveToken,
    setRefreshToken: saveRefreshToken,
    removeTokens,
    getUsername,
    isAccessTokenValid,
  };
}
