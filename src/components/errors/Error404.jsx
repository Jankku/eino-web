import { Container } from '@material-ui/core';
import Header from '../Header';

export default function Error404() {
  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p>I can't find the page... 😭</p>
      </Container>
    </>
  );
}
