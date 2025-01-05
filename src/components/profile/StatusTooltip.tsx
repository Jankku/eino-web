import { Box, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

type StatusTooltipProps = {
  state: 'enabled' | 'disabled' | 'unset';
  enabledTitle: string;
  disabledTitle: string;
  unsetTitle?: string;
};

export default function StatusTooltip({
  state,
  enabledTitle,
  disabledTitle,
  unsetTitle,
}: StatusTooltipProps) {
  const isSet = state !== 'unset';
  const isEnabled = state === 'enabled';
  const title = isSet ? (isEnabled ? enabledTitle : disabledTitle) : unsetTitle;
  const icon = isEnabled ? (
    <CheckCircleIcon
      role="presentation"
      color="success"
      fontSize="small"
      sx={{ alignSelf: 'center' }}
    />
  ) : (
    <CancelOutlinedIcon
      role="presentation"
      color="error"
      fontSize="small"
      sx={{ alignSelf: 'center' }}
    />
  );

  return (
    <Tooltip
      enterTouchDelay={500}
      leaveTouchDelay={3000}
      arrow
      title={<Typography variant="body2">{title}</Typography>}
      placement="top-start"
      slotProps={{
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
        },
      }}
    >
      <Box component="span" sx={{ paddingLeft: '4px', display: 'flex', alignContent: 'center' }}>
        {icon}
      </Box>
    </Tooltip>
  );
}
