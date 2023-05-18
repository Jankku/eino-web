import { Button, IconButton, Tooltip } from '@mui/material';
import useIsMobile from '../../hooks/useIsMobile';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ImageIcon from '@mui/icons-material/Image';
import { listItemTypes } from '../../hooks/useListItemType';

export default function ListItemTypeButton({ itemType, onClick }) {
  const isMobile = useIsMobile();

  const Icon = itemType === listItemTypes.CARD ? ImageIcon : ViewAgendaIcon;
  const label = itemType === listItemTypes.CARD ? listItemTypes.IMAGE : listItemTypes.CARD;

  return (
    <>
      {isMobile ? (
        <Tooltip arrow title="List item type" enterTouchDelay={500}>
          <span>
            <IconButton color="primary" size="large" onClick={onClick}>
              <Icon />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button variant="outlined" startIcon={<Icon />} onClick={onClick}>
          {label}
        </Button>
      )}
    </>
  );
}
