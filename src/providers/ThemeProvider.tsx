import { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/system';
import { blue, red } from '@mui/material/colors';
import '../css/fonts.css';
import type {} from '@mui/material/themeCssVarsAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class', nativeColor: true },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        TableCell: {
          border: 'rgba(0, 0, 0, 0.2)',
        },
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
        TableCell: {
          border: 'rgba(255, 255, 255, 0.2)',
        },
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnSeparator: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: 'fonts.css',
    },
    MuiButton: {
      styleOverrides: {
        contained: ({ theme }) =>
          theme.applyStyles('dark', {
            '&:not(.Mui-disabled)': {
              color: theme.vars.palette.common.black,
            },
          }),
      },
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
