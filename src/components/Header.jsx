import React from 'react';
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
import { createStyles, makeStyles } from '@material-ui/styles';
import { Link, NavLink, useHistory } from 'react-router-dom';
import useToken from '../utils/useToken';
import { getOtherThemeName, useThemeContext } from '../utils/theme';
import MenuIcon from '@material-ui/icons/Menu';
import WbSunnyRounded from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import { useState } from 'react';

const routeArray = [
  { name: 'Home', path: '' },
  { name: 'Books', path: 'books' },
  { name: 'Movies', path: 'movies' },
];

const authRouteArray = [
  { name: 'Register', path: 'register' },
  { name: 'Login', path: 'login' },
];

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    logo: {
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
    menuButton: {
      marginRight: '0.2em',
    },
    themeIcon: {
      display: 'flex',
      alignItems: 'center',
    },

    drawerPaper: {
      width: drawerWidth,
    },
    item: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
  })
);

export default function Header(props) {
  const classes = useStyles();
  const history = useHistory();
  const { window } = props;
  const { token, removeToken } = useToken();
  const { darkTheme, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const items = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <MenuList>
        {routeArray.map((item, index) => (
          <NavLink to={item.path} key={index} className={classes.item}>
            <MenuItem>
              <ListItemText primary={item.name} />
            </MenuItem>
          </NavLink>
        ))}
        <Divider />
        {!token
          ? authRouteArray.map((item, index) => (
              <NavLink to={item.path} key={index} className={classes.item}>
                <MenuItem>
                  <ListItemText primary={item.name} />
                </MenuItem>
              </NavLink>
            ))
          : []}
      </MenuList>
    </div>
  );

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="default"
            edge="start"
            className={classes.menuButton}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item className={classes.logo}>
              <Link to="/" className={classes.logo}>
                eino
              </Link>
            </Grid>

            <Grid item className={classes.themeIcon}>
              <IconButton onClick={() => toggleTheme()}>
                {darkTheme === true ? (
                  <WbSunnyRounded color="action" />
                ) : (
                  <Brightness2Icon />
                )}
              </IconButton>

              {token ? (
                <Button
                  color="default"
                  onClick={() => {
                    removeToken();
                    history.replace('/');
                  }}
                >
                  Log out
                </Button>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {items}
        </Drawer>
      </nav>
    </>
  );
}
