import { Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useIsMobile from '../../hooks/useIsMobile';

function CopyItemButton({ data, isDisabled, onSuccess, onFailure }) {
  const isMobile = useIsMobile();
  const copyTitlesToClipboard = async () => {
    try {
      const items = data
        .filter((i) => i.title !== '')
        .map((i) => {
          if (i.author) return `${i.author} - ${i.title}`;
          if (i.director) return `${i.director} - ${i.title}`;

          return i.title;
        })
        .join('\n');
      await navigator.clipboard.writeText(items);
      onSuccess();
    } catch (error) {
      console.log(error);
      onFailure();
    }
  };

  return (
    <>
      {isMobile ? (
        <Tooltip arrow title="Copy items" enterTouchDelay={500}>
          <span>
            <IconButton
              color="primary"
              size="large"
              onClick={copyTitlesToClipboard}
              disabled={isDisabled}
              sx={{ marginRight: 1 }}
            >
              <ContentCopyIcon />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          size="large"
          startIcon={<ContentCopyIcon />}
          disabled={isDisabled}
          onClick={copyTitlesToClipboard}
          sx={{ marginRight: 2 }}
        >
          Copy items
        </Button>
      )}
    </>
  );
}

export default CopyItemButton;
