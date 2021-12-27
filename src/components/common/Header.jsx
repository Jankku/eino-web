import React from 'react';
import {
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Toolbar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../utils/useToken';
import { useThemeContext } from '../../themes/theme';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import { useState } from 'react';
import { Box } from '@mui/system';
import { AppBar } from '@mui/material';
import CustomNavLink from './CustomNavLink';
import { useAuthContext } from '../../utils/auth';

const routeArray = [
  { name: 'Books', path: '/books' },
  { name: 'Movies', path: '/movies' },
];

const authRouteArray = [
  { name: 'Register', path: '/register' },
  { name: 'Login', path: '/login' },
];

export default function Header({ window, children }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const { getUsername } = useToken();
  const { darkTheme, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const drawerItems = (
    <Box role="presentation" sx={{ margin: '0em 0.5em' }}>
      <MenuList>
        <CustomNavLink item={{ name: 'Home', path: '/' }} />
        {isLoggedIn &&
          routeArray.map((item, index) => (
            <CustomNavLink item={item} key={index} />
          ))}
        <Divider />
        {!isLoggedIn &&
          authRouteArray.map((item, index) => (
            <CustomNavLink item={item} key={index} />
          ))}
        {isLoggedIn && (
          <Grid justifyContent="space-between">
            <Grid item>
              <MenuItem sx={{ mt: 1 }}>
                <PersonIcon sx={{ mr: 1 }} />
                {getUsername()}
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
  );

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
          color="default"
          edge="start"
          sx={{ mr: 2, display: { md: 'none' } }}
          onClick={handleDrawerToggle}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Grid container alignItems="center" justifyContent="space-between">
          <Link to="/">
            <Grid
              item
              sx={{
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
            </Grid>
          </Link>
          <Grid item>
            <IconButton onClick={() => toggleTheme()} size="large">
              {darkTheme === true ? (
                <WbSunnyRounded color="action" />
              ) : (
                <Brightness2Icon />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
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
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
