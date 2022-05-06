import { createContext, useContext, useState } from 'react';
import light from './light';
import dark from './dark';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';

const ThemeContext = createContext({});

export const useThemeContext = () => useContext(ThemeContext);

const getThemeValue = () => {
  if (
    localStorage.getItem('dark_theme') === undefined ||
    localStorage.getItem('dark_theme') === 'false'
  ) {
    return false;
  }

  if (localStorage.getItem('dark_theme') === 'true') return true;
};

export function EinoThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(getThemeValue());

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem('dark_theme', !darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={darkTheme ? createTheme(dark) : createTheme(light)}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
}
