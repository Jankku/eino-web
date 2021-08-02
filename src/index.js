import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const ThemeContext = createContext({});

export function useEinoThemeContext() {
  return useContext(ThemeContext);
}

function EinoThemeProvider(props) {
  const [isThemeDark, setIsThemeDark] = useState(
    Boolean(localStorage.getItem('is_theme_dark')) || false
  );

  const themeLight = createTheme({
    palette: {
      type: 'light',
      background: {
        default: '#DDD',
        paper: '#EEE',
      },
      primary: {
        main: blue[500],
      },
      secondary: {
        main: blue[300],
      },
    },
  });

  const themeDark = createTheme({
    palette: {
      type: 'dark',
      background: {
        default: '#303030',
        paper: '#353535',
      },
      primary: {
        main: blue[300],
      },
      secondary: {
        main: blue[100],
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isThemeDark, setIsThemeDark }}>
      <ThemeProvider theme={isThemeDark ? themeDark : themeLight}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <EinoThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EinoThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
