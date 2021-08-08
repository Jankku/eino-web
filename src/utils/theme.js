import React, { createContext, useContext, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import light from '../themes/light';
import dark from '../themes/dark';

const ThemeContext = createContext({});

export const useThemeContext = () => useContext(ThemeContext);

const getThemeValue = () => {
  if (
    localStorage.getItem('darkTheme') === undefined ||
    localStorage.getItem('darkTheme') === 'false'
  ) {
    return false;
  }

  if (localStorage.getItem('darkTheme') === 'true') return true;
};

export function EinoThemeProvider(props) {
  const [darkTheme, setDarkTheme] = useState(getThemeValue());

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem('darkTheme', !darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      <ThemeProvider theme={darkTheme ? createTheme(dark) : createTheme(light)}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
