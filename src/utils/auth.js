import { createContext, useContext, useState } from 'react';
import useToken from './useToken';

const AuthContext = createContext(false);

export const useAuthContext = () => useContext(AuthContext);

export function EinoAuthenticationProvider({ children }) {
  const { token, isAccessTokenValid } = useToken();
  const checkLoginStatus = () => (token && isAccessTokenValid()) || false;
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoginStatus());

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
