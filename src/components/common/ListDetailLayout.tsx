import { Grid } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import PanelContainer from './PanelContainer.tsx';

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
        <Grid
          item
          sx={{
            minWidth: '65%',
          }}
        >
          <PanelContainer>{list}</PanelContainer>
        </Grid>
        <Grid
          item
          sx={{
            minWidth: '35%',
          }}
        >
          <PanelContainer>{detail}</PanelContainer>
        </Grid>
      </Grid>
    );
  }
}
