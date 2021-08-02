import jwt_decode from 'jwt-decode';
import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    setToken(token);

    const { userId, username } = jwt_decode(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('username', username);
  };

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
  };

  return {
    token,
    setToken: saveToken,
    removeToken,
  };
}
