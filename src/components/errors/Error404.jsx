import { Container } from '@material-ui/core';
import Header from '../common/Header';

export default function Error404() {
  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ textAlign: 'center' }}>
        <h1>404 Not Found</h1>
        <p>I can't find the page... 😭</p>
      </Container>
    </>
  );
}
