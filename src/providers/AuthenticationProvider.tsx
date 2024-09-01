import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useToken } from '../hooks/useToken';

const AuthContext = createContext<{
  username: string;
  email: string | null;
  is2FAEnabled: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}>({
  username: '',
  email: null,
  is2FAEnabled: false,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { getUsername, getEmail, getIs2FAEnabled, isAccessTokenValid, isRefreshTokenValid } =
    useToken();
  const [username] = useState(() => getUsername());
  const [email] = useState(() => getEmail());
  const [is2FAEnabled] = useState(() => getIs2FAEnabled());
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAccessTokenValid() && isRefreshTokenValid());

  return (
    <AuthContext.Provider value={{ username, email, is2FAEnabled, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthenticationProvider');
  }
  return context;
};
