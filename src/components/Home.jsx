import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
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
      </Container>
    </>
  );
}
