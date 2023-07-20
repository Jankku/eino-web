import { StrictMode } from 'react';
import './css/index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthenticationProvider } from './providers/AuthenticationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider>
        <AuthenticationProvider>
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
        </AuthenticationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
);
