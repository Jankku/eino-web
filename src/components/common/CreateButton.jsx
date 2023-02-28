import { Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useIsMobile from '../../hooks/useIsMobile';

export default function CreateButton({ onClick }) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <Tooltip arrow title="Create" enterTouchDelay={500}>
          <span>
            <IconButton color="primary" size="large" onClick={onClick}>
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onClick}>
          Create
        </Button>
      )}
    </>
  );
}
