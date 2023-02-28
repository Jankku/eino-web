import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function CreateFab({ onClick }) {
  return (
    <Fab color="primary" aria-label="Create" onClick={onClick}>
      <AddIcon />
    </Fab>
  );
}
