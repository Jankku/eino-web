import { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { blue, red } from '@mui/material/colors';
import '../css/fonts.css';
import type {} from '@mui/material/themeCssVarsAugmentation';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        background: {
          default: '#edf8ff',
          paper: '#FFF',
        },
        primary: {
          main: blue[500],
        },
        secondary: {
          main: red[500],
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: '#191b21',
          paper: '#25272c',
        },
        primary: {
          main: blue[300],
        },
        secondary: {
          main: red[300],
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: 'fonts.css',
    },
    MuiFab: {
      styleOverrides: {
        root: {
          position: 'fixed',
          bottom: '16px',
          right: '16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '0.3em 0em',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: 'palette.text.primary',
          margin: '0.5em 0em',
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          alignSelf: 'end',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme} defaultMode="dark" noSsr forceThemeRerender>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
