import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
  Stack,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BookSearch from '../books/BookSearch';
import MovieSearch from '../movies/MovieSearch';

type AppbarProps = {
  drawerWidth: number;
  drawerOpen: boolean;
  toggleDrawer: () => void;
};

export default function Appbar({ drawerWidth, drawerOpen, toggleDrawer }: AppbarProps) {
  const location = useLocation();
  const { mode, setMode } = useColorScheme();
  const isBookPath = location.pathname.includes('/books');
  const isMoviePath = location.pathname.includes('/movies');

  const isDark = mode === 'dark';

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppBar
      position="sticky"
      sx={(theme) => ({
        width: {
          md: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { md: `${drawerWidth}px` },
        ...theme.applyStyles('dark', {
          backgroundColor: theme.vars.palette.background.default,
        }),
      })}
    >
      <Toolbar>
        <IconButton
          name="drawer"
          color="inherit"
          edge="start"
          aria-label={drawerOpen ? 'Close drawer' : 'Open drawer'}
          aria-expanded={drawerOpen}
          aria-controls={drawerOpen ? 'mobile-navigation-drawer' : undefined}
          aria-haspopup="dialog"
          sx={{ mr: 2, display: { md: 'none' } }}
          onClick={toggleDrawer}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Stack
          direction="row"
          sx={{
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'center',
            gap: { sm: 2 },
            justifyContent: { sm: 'space-between' },
          }}
        >
          <Link to="/home" aria-label="Eino home">
            <Typography
              sx={{
                display: { xs: 'none', sm: 'block' },
                margin: '0em 0em 0.2em 0em',
                fontFamily: 'Pacifico, cursive',
                fontSize: '32px',
                color: '#FFFFFF',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              eino
            </Typography>
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 2 }}>
            <Stack
              direction="row"
              sx={{
                flexWrap: 'wrap',
                width: '100%',
                alignItems: 'center',
                justifyContent: { sm: 'flex-end' },
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0, flexGrow: 1, maxWidth: '25em' }}>
                {isBookPath ? <BookSearch /> : null}
                {isMoviePath ? <MovieSearch /> : null}
              </Box>
              <Box>
                <Tooltip arrow title={`${isDark ? 'Light' : 'Dark'} theme`} enterTouchDelay={500}>
                  <IconButton
                    aria-label={`${isDark ? 'Light' : 'Dark'} theme`}
                    onClick={toggleTheme}
                    size="large"
                  >
                    {isDark ? (
                      <WbSunnyRounded />
                    ) : (
                      <Brightness2Icon
                        sx={(theme) => theme.applyStyles('light', { color: 'white' })}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
