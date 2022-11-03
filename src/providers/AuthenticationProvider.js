import { createContext, useContext, useState, useMemo } from 'react';
import useToken from '../hooks/useToken';

const AuthContext = createContext(false);

export const useAuthContext = () => useContext(AuthContext);

export function AuthenticationProvider({ children }) {
  const { isAccessTokenValid, isRefreshTokenValid } = useToken();
  const checkLoginStatus = () => isAccessTokenValid() && isRefreshTokenValid();
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoginStatus());

  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
