import React from 'react';
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Switch,
  Toolbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link, useHistory } from 'react-router-dom';
import useToken from '../utils/useToken';
import { useEinoThemeContext } from '..';
import WbSunnyRounded from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2';

const useStyles = makeStyles({
  logo: {
    marginBottom: '0.1em',
    fontFamily: 'Pacifico, cursive',
    fontSize: '32px',
    letterSpacing: '0.03em',
    color: '#FFFFFF',
    textDecoration: 'none',
    '&:hover': {
      color: '#DDDDDD',
    },
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const { token, removeToken } = useToken();
  const { isThemeDark, setIsThemeDark } = useEinoThemeContext();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item className={classes.logo}>
            <Link to="/" className={classes.logo}>
              eino
            </Link>
          </Grid>

          <Grid item className={classes.icon}>
            {isThemeDark ? (
              <IconButton
                onClick={() => {
                  setIsThemeDark((prev) => {
                    localStorage.setItem('is_theme_dark', !prev);
                    return !prev;
                  });
                }}
              >
                <WbSunnyRounded color="action" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setIsThemeDark((prev) => {
                    localStorage.setItem('is_theme_dark', !prev);
                    return !prev;
                  });
                }}
              >
                <Brightness2Icon />
              </IconButton>
            )}

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
  );
}
