import { createContext, useContext, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { dark, light } from '../themes';

const ThemeContext = createContext();

const getCurrentTheme = () => {
  return localStorage.getItem('dark_theme') === 'true';
};

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(() => getCurrentTheme());

  const toggleTheme = () => {
    setDarkTheme((prev) => {
      localStorage.setItem('dark_theme', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={darkTheme ? createTheme(dark) : createTheme(light)}>
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
