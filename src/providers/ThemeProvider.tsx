import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useSyncExternalStore,
  useCallback,
} from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { dark } from '../themes/dark';
import { light } from '../themes/light';

const THEME_KEY = 'dark_theme';

const getThemeFromLocalStorage = (defaultValue: boolean) => () => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === null ? defaultValue : JSON.parse(theme);
};

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
};

const ThemeContext = createContext<{ isDark: boolean; toggleTheme: () => void }>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const getTheme = useCallback(
    () => getThemeFromLocalStorage(prefersDarkMode)(),
    [prefersDarkMode],
  );
  const isDark = useSyncExternalStore(subscribe, getTheme);

  const toggleTheme = useCallback(() => {
    const previousTheme = localStorage.getItem(THEME_KEY);
    const newValue = previousTheme === null ? !prefersDarkMode : !JSON.parse(previousTheme);
    localStorage.setItem(THEME_KEY, JSON.stringify(newValue));
    window.dispatchEvent(new Event('storage'));
  }, [prefersDarkMode]);

  const theme = useMemo(() => (isDark ? dark : light), [isDark]);

  return (
    <ThemeContext value={{ isDark, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ThemeContext>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within EinoThemeProvider');
  }
  return context;
};
