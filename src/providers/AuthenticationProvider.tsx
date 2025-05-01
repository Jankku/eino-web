import { createContext, ReactNode, useContext } from 'react';
import { useToken } from '../hooks/useToken';

const AuthContext = createContext<{
  username: string;
  role: string | null | undefined;
  is2FAEnabled: boolean;
  isLoggedIn: boolean;
}>({
  username: '',
  role: null,
  is2FAEnabled: false,
  isLoggedIn: false,
});

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { username, role, is2FAEnabled, isLoggedIn } = useToken();

  return <AuthContext value={{ username, role, is2FAEnabled, isLoggedIn }}>{children}</AuthContext>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthenticationProvider');
  }
  return context;
};
