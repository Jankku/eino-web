import { createContext, useContext, useState } from 'react';
import useToken from '../hooks/useToken';

const AuthContext = createContext();

export function AuthenticationProvider({ children }) {
  const { isAccessTokenValid, isRefreshTokenValid } = useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAccessTokenValid() && isRefreshTokenValid());

  const value = { isLoggedIn, setIsLoggedIn };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthenticationProvider');
  }
  return context;
};
