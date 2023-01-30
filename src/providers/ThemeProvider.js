import { createContext, useContext, useState } from 'react';
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { dark, light } from '../themes';
import { useMemo } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
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
      localStorage.setItem('dark_theme', !prev);
      return !prev;
    });
  };

  const theme = useMemo(() => (isDark ? createTheme(dark) : createTheme(light)), [isDark]);

  return (
    <ThemeContext.Provider value={{ darkTheme: isDark, toggleTheme }}>
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
