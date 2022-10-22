import { StrictMode } from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { EinoThemeProvider } from './themes/theme';
import { EinoAuthenticationProvider } from './utils/auth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  staleTime: 5 * 60 * 1000,
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

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
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </SnackbarProvider>
          </BrowserRouter>
        </EinoAuthenticationProvider>
      </EinoThemeProvider>
    </LocalizationProvider>
  </StrictMode>
);
