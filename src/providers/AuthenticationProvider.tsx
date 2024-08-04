import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useToken } from '../hooks/useToken';

const AuthContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { isAccessTokenValid, isRefreshTokenValid } = useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAccessTokenValid() && isRefreshTokenValid());

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthenticationProvider');
  }
  return context;
};
