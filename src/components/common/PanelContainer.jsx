import { Container } from '@mui/material';

export default function PanelContainer({ children }) {
  return (
    <Container
      // Height is window height minus appbar height
      sx={{ height: window.innerHeight - 65, overflowY: 'scroll', overflowX: 'hidden' }}
    >
      {children}
    </Container>
  );
}
