import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type CreateFabProps = {
  onClick: () => void;
};

export default function CreateFab({ onClick }: CreateFabProps) {
  return (
    <Fab color="primary" aria-label="Create" onClick={onClick}>
      <AddIcon />
    </Fab>
  );
}
