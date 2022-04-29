import { StrictMode } from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { EinoThemeProvider } from './themes/theme';
import { EinoAuthenticationProvider } from './utils/auth';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <EinoThemeProvider>
        <EinoAuthenticationProvider>
          <BrowserRouter>
            <SnackbarProvider
              TransitionComponent={Fade}
              sx={{
                mt: '3em',
              }}
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
  </StrictMode>
);
