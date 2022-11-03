import { useState } from 'react';
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { useThemeContext } from '../../themes/theme';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import LocalMovies from '@mui/icons-material/LocalMovies';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LoginIcon from '@mui/icons-material/Login';
import { Box } from '@mui/system';
import CustomNavLink from './CustomNavLink';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import BookSearch from '../books/BookSearch';
import MovieSearch from '../movies/MovieSearch';
import Footer from './Footer';

const routeArray = [
  { name: 'Books', path: '/books', icon: <MenuBook sx={{ mr: 1 }} /> },
  { name: 'Movies', path: '/movies', icon: <LocalMovies sx={{ mr: 1 }} /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon sx={{ mr: 1 }} /> },
];

const authRouteArray = [
  { name: 'Register', path: '/register', icon: <VpnKeyIcon sx={{ mr: 1 }} /> },
  { name: 'Login', path: '/login', icon: <LoginIcon sx={{ mr: 1 }} /> },
];

export default function Header({ window, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const { getUsername } = useToken();
  const { darkTheme, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const drawerWidth = 240;

  const isBookPath = () => location.pathname.includes('/books');
  const isMoviePath = () => location.pathname.includes('/movies');

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const MyAppBar = (
    <AppBar
      position="sticky"
      sx={{
        width: {
          md: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { md: 'none' } }}
          onClick={handleDrawerToggle}
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
                letterSpacing: '0.03em',
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
          <Grid item>
            <Grid
              container
              alignItems="center"
              sx={{
                width: { xs: '80vw', sm: '60vw', md: '50vw' },
              }}
              justifyContent={{
                sm: 'flex-end',
              }}
              gap={2}
            >
              <Grid item sx={{ flexGrow: 1, maxWidth: '25em' }}>
                {isBookPath() ? <BookSearch /> : null}
                {isMoviePath() ? <MovieSearch /> : null}
              </Grid>
              <Grid item>
                <IconButton onClick={() => toggleTheme()} size="large">
                  {darkTheme === true ? (
                    <WbSunnyRounded />
                  ) : (
                    <Brightness2Icon
                      sx={(theme) =>
                        theme.palette.mode === 'light' && {
                          color: 'white',
                        }
                      }
                    />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  const drawerItems = (
    <>
      <Box role="presentation" sx={{ margin: '0em 0.5em' }}>
        <MenuList>
          <CustomNavLink item={{ name: 'Home', path: '/', icon: <Home sx={{ mr: 1 }} /> }} />
          {isLoggedIn && routeArray.map((item, index) => <CustomNavLink item={item} key={index} />)}
          <Divider />
          {!isLoggedIn &&
            authRouteArray.map((item, index) => <CustomNavLink item={item} key={index} />)}
          {isLoggedIn && (
            <Grid justifyContent="space-between">
              <Grid item>
                <MenuItem sx={{ mt: 0.5 }}>
                  <Typography fontWeight={500} noWrap>
                    {getUsername()}
                  </Typography>
                </MenuItem>
              </Grid>

              <Grid item>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<LogoutIcon />}
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/logout')}
                >
                  Log out
                </Button>
              </Grid>
            </Grid>
          )}
        </MenuList>
      </Box>
      <Grid container sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <Grid item sx={{ alignSelf: 'flex-end' }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );

  const mobileDrawer = (
    <Drawer
      container={container}
      variant="temporary"
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerItems}
    </Drawer>
  );

  const permanentDrawer = (
    <Drawer
      container={container}
      variant="permanent"
      anchor="left"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      {drawerItems}
    </Drawer>
  );

  return (
    <>
      {MyAppBar}
      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          sx={{
            height: '100%',
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
          }}
        >
          {mobileDrawer}
          {permanentDrawer}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
