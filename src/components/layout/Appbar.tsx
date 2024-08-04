import { AppBar, Grid, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BookSearch from '../books/BookSearch';
import MovieSearch from '../movies/MovieSearch';
import { useThemeContext } from '../../providers/ThemeProvider';

type AppbarProps = {
  drawerWidth: number;
  toggleDrawer: () => void;
};

export default function Appbar({ drawerWidth, toggleDrawer }: AppbarProps) {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeContext();
  const isBookPath = location.pathname.includes('/books');
  const isMoviePath = location.pathname.includes('/movies');

  return (
    <AppBar
      position="sticky"
      sx={{
        width: {
          xl: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { xl: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          name="drawer"
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { xl: 'none' } }}
          onClick={toggleDrawer}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Grid
          container
          alignItems="center"
          gap={{ sm: 2 }}
          justifyContent={{
            sm: 'space-between',
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
          <Grid item flexGrow={2}>
            <Grid
              container
              alignItems="center"
              justifyContent={{
                sm: 'flex-end',
              }}
              gap={2}
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
                        sx={(theme) =>
                          theme.palette.mode === 'light'
                            ? {
                                color: 'white',
                              }
                            : {}
                        }
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
