import { Container } from '@mui/material';

type PanelContainerProps = {
  list?: boolean;
  children: React.ReactNode;
};

export default function PanelContainer({ list, children }: PanelContainerProps) {
  return (
    <Container
      // Height is window height minus appbar height
      sx={[
        {
          height: window.innerHeight - 65,
          overflowY: 'scroll',
          overflowX: 'hidden',
        },
        list
          ? {
              maxWidth: '100% !important',
              paddingLeft: { xxl: 24 },
            }
          : {},
      ]}
    >
      {children}
    </Container>
  );
}
