import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { dark } from '../themes/dark';
import { light } from '../themes/light';

const ThemeContext = createContext<{ isDark: boolean; toggleTheme: () => void }>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(() => {
    const value = localStorage.getItem('dark_theme');
    if (value !== null) {
      return JSON.parse(value) === true;
    } else {
      return prefersDarkMode;
    }
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      localStorage.setItem('dark_theme', !prev as unknown as string);
      return !prev;
    });
  };

  const theme = useMemo(() => (isDark ? dark : light), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within EinoThemeProvider');
  }
  return context;
};
