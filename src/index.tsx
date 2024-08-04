import { StrictMode } from 'react';
import './css/index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { AuthenticationProvider } from './providers/AuthenticationProvider.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider>
        <AuthenticationProvider>
          <BrowserRouter>
            <SnackbarProvider
              TransitionComponent={Fade}
              // @ts-expect-error -- Valid
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
        </AuthenticationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
);
