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

  const removeToken = () => {
    localStorage.removeItem('accessToken');
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

  const removeRefreshToken = () => localStorage.removeItem('refreshToken');

  const getUsername = () => localStorage.getItem('username');

  return {
    token,
    refreshToken,
    setToken: saveToken,
    setRefreshToken: saveRefreshToken,
    removeToken,
    removeRefreshToken,
    getUsername,
  };
}
