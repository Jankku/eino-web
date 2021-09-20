import { Container } from '@mui/material';
import React from 'react';
import Header from '../components/common/Header';

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
