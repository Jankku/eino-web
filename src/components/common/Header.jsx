import React from 'react';
import { styled } from '@mui/system';
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

const PREFIX = 'Header';

const classes = {
  logo: `${PREFIX}-logo`,
};

const Root = styled('div')(({ theme }) => ({
  toolbar: theme.mixins.toolbar,

  [`& .${classes.logo}`]: {
    margin: '0em 0em 0.2em 0em',
    fontFamily: 'Pacifico, cursive',
    fontSize: '32px',
    letterSpacing: '0.03em',
    color: '#FFFFFF',
    textDecoration: 'none',
    '&:hover': {
      color: '#DDDDDD',
    },
  },
}));

const routeArray = [
  { name: 'Home', path: '/' },
  { name: 'Books', path: '/books' },
  { name: 'Movies', path: '/movies' },
];

const authRouteArray = [
  { name: 'Register', path: '/register' },
  { name: 'Login', path: '/login' },
];

export default function Header({ window }) {
  const navigate = useNavigate();
  const { token, getUsername } = useToken();
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
      <div className={classes.toolbar} />
      <MenuList>
        {routeArray.map((item, index) => (
          <CustomNavLink item={item} key={index} />
        ))}
        <Divider />
        {!token
          ? authRouteArray.map((item, index) => (
              <CustomNavLink item={item} key={index} />
            ))
          : []}
        {!token ? (
          []
        ) : (
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
      className={classes.appBar}
      position="sticky"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="default"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleDrawerToggle}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item className={classes.logo}>
            <Link to="/" className={classes.logo}>
              eino
            </Link>
          </Grid>

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

  return (
    <Root>
      {MyAppBar}
      <Drawer
        container={container}
        variant="temporary"
        elevation={0}
        sx={{
          display: { xs: 'block', sm: 'none' },
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
      <Drawer
        container={container}
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerItems}
      </Drawer>
    </Root>
  );
}
