import { Chip, Tooltip, Typography } from '@mui/material';
import { getStatusColor, getStatusIcon } from '../../utils/listItemUtil';

export default function StatusChip({
  status,
  tooltipText,
  chipText,
}: {
  status: string;
  tooltipText: string;
  chipText: string;
}) {
  return (
    <Tooltip
      enterTouchDelay={0}
      leaveTouchDelay={50_000}
      arrow
      title={<Typography variant="body2">{tooltipText}</Typography>}
      placement="top-start"
      slotProps={{
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
        },
      }}
    >
      <Chip
        icon={getStatusIcon(status, 'white')}
        label={chipText}
        sx={(theme) => ({
          backgroundColor: 'transparent',
          color: getStatusColor(status, theme),
          fontWeight: 500,
        })}
      />
    </Tooltip>
  );
}
