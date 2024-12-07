import { createContext, ReactNode, useContext } from 'react';
import { useToken } from '../hooks/useToken';

const AuthContext = createContext<{
  username: string;
  email: string | null | undefined;
  role: string | null | undefined;
  is2FAEnabled: boolean;
  isLoggedIn: boolean;
}>({
  username: '',
  email: null,
  role: null,
  is2FAEnabled: false,
  isLoggedIn: false,
});

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { username, email, role, is2FAEnabled, isLoggedIn } = useToken();

  return (
    <AuthContext value={{ username, email, role, is2FAEnabled, isLoggedIn }}>
      {children}
    </AuthContext>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthenticationProvider');
  }
  return context;
};
