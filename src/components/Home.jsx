import { Container } from '@material-ui/core';
import React from 'react';
import Header from './common/Header';

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <h1>eino</h1>
      </Container>
    </>
  );
}
