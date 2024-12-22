import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BookSearch from '../books/BookSearch';
import MovieSearch from '../movies/MovieSearch';

type AppbarProps = {
  drawerWidth: number;
  toggleDrawer: () => void;
};

export default function Appbar({ drawerWidth, toggleDrawer }: AppbarProps) {
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
          xl: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { xl: `${drawerWidth}px` },
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.background.default,
        }),
      })}
    >
      <Toolbar>
        <IconButton
          name="drawer"
          color="inherit"
          edge="start"
          aria-label="Open drawer"
          sx={{ mr: 2, display: { xl: 'none' } }}
          onClick={toggleDrawer}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Grid
          container
          sx={{
            alignItems: 'center',
            gap: { sm: 2 },

            justifyContent: {
              sm: 'space-between',
            },
          }}
        >
          <Link to="/">
            <Typography
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
                margin: '0em 0em 0.2em 0em',
                fontFamily: 'Pacifico, cursive',
                fontSize: '32px',
                color: '#FFFFFF',
                textDecoration: 'none',
                '&:hover': {
                  color: '#DDDDDD',
                },
              }}
            >
              eino
            </Typography>
          </Link>
          <Grid
            item
            sx={{
              flexGrow: 2,
            }}
          >
            <Grid
              container
              sx={{
                alignItems: 'center',

                justifyContent: {
                  sm: 'flex-end',
                },

                gap: 2,
              }}
            >
              <Grid item sx={{ flexGrow: 1, maxWidth: '25em' }}>
                {isBookPath ? <BookSearch /> : null}
                {isMoviePath ? <MovieSearch /> : null}
              </Grid>
              <Grid item>
                <Tooltip arrow title={`${isDark ? 'Light' : 'Dark'} theme`} enterTouchDelay={500}>
                  <IconButton onClick={() => toggleTheme()} size="large">
                    {isDark ? (
                      <WbSunnyRounded />
                    ) : (
                      <Brightness2Icon
                        sx={(theme) => theme.applyStyles('light', { color: 'white' })}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
