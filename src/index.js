import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { EinoThemeProvider } from './themes/theme';
import { EinoAuthenticationProvider } from './utils/auth';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <EinoThemeProvider>
        <EinoAuthenticationProvider>
          <BrowserRouter>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <App />
            </SnackbarProvider>
          </BrowserRouter>
        </EinoAuthenticationProvider>
      </EinoThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
