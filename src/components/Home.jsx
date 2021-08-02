import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  link: {
    padding: '0.5em',
    fontWeight: '700',
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Header />
      <Container maxWidth="md" className={classes.root}>
        <h1>eino</h1>
        <Link to="/register" className={classes.link}>
          Register
        </Link>
        <Link to="/login" className={classes.link}>
          Login
        </Link>
        <Link to="/books" className={classes.link}>
          Books
        </Link>
      </Container>
    </>
  );
}
