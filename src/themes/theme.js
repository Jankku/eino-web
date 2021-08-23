import React, { createContext, useContext, useState } from 'react';
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import light from './light';
import dark from './dark';

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

export function EinoThemeProvider(props) {
  const [darkTheme, setDarkTheme] = useState(getThemeValue());

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem('dark_theme', !darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider
          theme={darkTheme ? createTheme(dark) : createTheme(light)}
        >
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
}
