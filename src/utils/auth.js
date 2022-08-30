import { createContext, useContext, useState, useMemo } from 'react';
import useToken from '../hooks/useToken';

const AuthContext = createContext(false);

export const useAuthContext = () => useContext(AuthContext);

export function EinoAuthenticationProvider({ children }) {
  const { token, isAccessTokenValid } = useToken();
  const checkLoginStatus = () => (token && isAccessTokenValid()) || false;
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoginStatus());

  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
