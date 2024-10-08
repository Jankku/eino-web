import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const [username, setUsername] = useState(() => getUsername());
  const [email, setEmail] = useState(() => getEmail());
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => getIs2FAEnabled());
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAccessTokenValid() && isRefreshTokenValid());

  useEffect(() => {
    if (isLoggedIn) {
      setUsername(getUsername());
      setEmail(getEmail());
      setIs2FAEnabled(getIs2FAEnabled());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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
