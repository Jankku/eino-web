import { Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useIsMobile } from '../../hooks/useIsMobile';

function CopyItemButton({ disabled, onClick }) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Tooltip arrow title="Copy" enterTouchDelay={500}>
          <span>
            <IconButton color="primary" size="large" onClick={onClick} disabled={disabled}>
              <ContentCopyIcon />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          disabled={disabled}
          onClick={onClick}
        >
          Copy
        </Button>
      )}
    </>
  );
}

export default CopyItemButton;
