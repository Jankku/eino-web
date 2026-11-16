import { StrictMode } from 'react';
import './css/index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { SnackbarProvider } from 'notistack';
import Fade from '@mui/material/Fade';
import App from './App.tsx';
import { handlePreloadError } from './utils/preloadErrorUtil';

window.addEventListener('vite:preloadError', handlePreloadError);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SnackbarProvider
          maxSnack={1}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
