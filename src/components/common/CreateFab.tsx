import { Fab, FabProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CreateFab(props: FabProps) {
  return (
    <Fab {...props} color="primary" aria-label="Create">
      <AddIcon />
    </Fab>
  );
}
