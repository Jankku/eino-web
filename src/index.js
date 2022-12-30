import { StrictMode } from 'react';
import './css/index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthenticationProvider } from './providers/AuthenticationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 1000,
      retry: 2,
    },
  },
});

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
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <App />
              </QueryClientProvider>
            </SnackbarProvider>
          </BrowserRouter>
        </AuthenticationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>
);
