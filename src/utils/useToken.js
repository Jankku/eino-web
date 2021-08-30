import jwt_decode from 'jwt-decode';
import { useState } from 'react';

export default function useToken() {
  const getToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  const [token, setToken] = useState(getToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());

  const saveToken = (accessToken) => {
    try {
      setToken(accessToken);
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
      setRefreshToken(refreshToken);
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
