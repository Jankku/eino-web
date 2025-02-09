import { Grid } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile.ts';
import PanelContainer from '../common/PanelContainer.tsx';

type ListDetailLayoutProps = {
  list: React.ReactNode;
  detail: React.ReactNode;
  id: string | undefined;
};

export default function ListDetailLayout({ list, detail, id }: ListDetailLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return id ? detail : list;
  } else {
    return (
      <Grid
        container
        sx={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Grid item sx={{ minWidth: { xs: '55%', lg: '65%' } }}>
          <PanelContainer>{list}</PanelContainer>
        </Grid>
        <Grid item sx={{ minWidth: 'max(35%, 400px)' }}>
          <PanelContainer>{detail}</PanelContainer>
        </Grid>
      </Grid>
    );
  }
}
