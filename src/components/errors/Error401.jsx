import { Button, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Header from '../common/Header';

export default function Error401() {
  const history = useHistory();

  const redirectToLoginPage = () => {
    history.replace('/login');
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ textAlign: 'center' }}>
        <h1>401 Unauthorized</h1>
        <p>Please login before trying to reach this page.</p>
        <Button
          variant="contained"
          color="primary"
          onClick={redirectToLoginPage}
        >
          Login
        </Button>
      </Container>
    </>
  );
}
