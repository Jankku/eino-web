import React from 'react';
import { styled } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  Toolbar,
} from '@material-ui/core';
import { Link, NavLink, useHistory } from 'react-router-dom';
import useToken from '../../utils/useToken';
import { useThemeContext } from '../../themes/theme';
import MenuIcon from '@material-ui/icons/Menu';
import WbSunnyRounded from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import { useState } from 'react';
import { Box } from '@material-ui/system';

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
  { name: 'Home', path: '' },
  { name: 'Books', path: '/books' },
  { name: 'Movies', path: '/movies' },
];

const authRouteArray = [
  { name: 'Register', path: 'register' },
  { name: 'Login', path: 'login' },
];

export default function Header(props) {
  const history = useHistory();
  const { window } = props;
  const { token, getUsername } = useToken();
  const { darkTheme, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const items = (
    <Box role="presentation" sx={{ width: 250 }}>
      <div className={classes.toolbar} />
      <Divider />
      <MenuList>
        {routeArray.map((item, index) => (
          <NavLink to={item.path} key={index}>
            <MenuItem
              sx={{
                color: (theme) => theme.palette.text.primary,
                textDecoration: 'none',
              }}
            >
              <ListItemText primary={item.name} />
            </MenuItem>
          </NavLink>
        ))}

        <Divider />

        {!token
          ? authRouteArray.map((item, index) => (
              <NavLink to={item.path} key={index}>
                <MenuItem
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    textDecoration: 'none',
                  }}
                >
                  <ListItemText primary={item.name} />
                </MenuItem>
              </NavLink>
            ))
          : []}

        {!token ? (
          []
        ) : (
          <Grid justifyContent="space-between">
            <Grid item>
              <MenuItem>{getUsername()}</MenuItem>
            </Grid>

            <Grid item>
              <Button
                sx={{ color: 'text.primary', pl: '1em' }}
                onClick={() => history.push('/logout')}
              >
                Log out
              </Button>
            </Grid>
          </Grid>
        )}
      </MenuList>
    </Box>
  );

  return (
    <Root>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="default"
            edge="start"
            sx={{ marginRight: '0.2em' }}
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
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {items}
        </Drawer>
      </nav>
    </Root>
  );
}
