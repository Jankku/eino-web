import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    footer: {
      textAlign: 'center',
    },
    link: {
      color: theme.palette.text.primary,
    },
  })
);

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <p>Made by Jankku</p>
      <a
        href="https://github.com/Jankku/eino-web"
        target="_blank"
        rel="noreferrer"
        className={classes.link}
      >
        Github
      </a>
    </footer>
  );
}
