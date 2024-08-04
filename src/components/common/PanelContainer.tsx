import { Container } from '@mui/material';

type PanelContainerProps = {
  children: React.ReactNode;
};

export default function PanelContainer({ children }: PanelContainerProps) {
  return (
    <Container
      // Height is window height minus appbar height
      sx={{ height: window.innerHeight - 65, overflowY: 'scroll', overflowX: 'hidden' }}
    >
      {children}
    </Container>
  );
}
