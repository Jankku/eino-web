import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { EinoThemeProvider } from './themes/theme';
import { EinoAuthenticationProvider } from './utils/auth';
import { StyledEngineProvider } from '@mui/system';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterLuxon from '@mui/lab/AdapterLuxon';

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <StyledEngineProvider injectFirst>
        <EinoThemeProvider>
          <EinoAuthenticationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </EinoAuthenticationProvider>
        </EinoThemeProvider>
      </StyledEngineProvider>
    </LocalizationProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
