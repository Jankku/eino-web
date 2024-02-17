import { Grid } from '@mui/material';
import { useIsMobile } from '../../hooks/useIsMobile';
import PanelContainer from './PanelContainer';

export default function ListDetailLayout({ list, detail, id }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return id ? detail : list;
  } else {
    return (
      <Grid
        container
        flexDirection="row"
        flexWrap="nowrap"
        width="100%"
        sx={{ overflow: 'hidden' }}
      >
        <Grid item minWidth="60%">
          <PanelContainer>{list}</PanelContainer>
        </Grid>
        <Grid item minWidth="40%">
          <PanelContainer>{detail}</PanelContainer>
        </Grid>
      </Grid>
    );
  }
}
