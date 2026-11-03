import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import { listItemTypes } from '../../hooks/useListItemType';

type ListViewToggleProps = {
  itemType: string;
  onToggle: () => void;
};

export default function ListViewToggle({ itemType, onToggle }: ListViewToggleProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={itemType}
      onChange={(_, value: string | null) => {
        if (value !== null && value !== itemType) onToggle();
      }}
      aria-label="List view"
      size="small"
      color="primary"
      sx={{
        '& .MuiToggleButton-root': {
          minWidth: 44,
          minHeight: { xs: 44, md: 40 },
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        },
      }}
    >
      <Tooltip title="Image view">
        <ToggleButton value={listItemTypes.IMAGE} aria-label="Image view">
          <ViewModuleIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Card view">
        <ToggleButton value={listItemTypes.CARD} aria-label="Card view">
          <ViewAgendaIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
