import { useState } from 'react';
import { ClickAwayListener, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router';

type BookActionsFabProps = {
  onCreate: () => void;
};

export default function BookActionsFab({ onCreate }: BookActionsFabProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <SpeedDial
        ariaLabel="Add book"
        icon={<SpeedDialIcon />}
        open={open}
        onOpen={(_event, reason) => {
          if (reason === 'toggle') {
            setOpen(true);
          }
        }}
        onClose={(_event, reason) => {
          if (reason !== 'mouseLeave') {
            setOpen(false);
          }
        }}
        sx={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          right: 'max(16px, env(safe-area-inset-right))',
          '& .MuiFab-root': { position: 'relative', bottom: 'auto', right: 'auto' },
        }}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          slotProps={{
            tooltip: () => ({ title: 'New book', open: true }),
            staticTooltipLabel: { sx: { whiteSpace: 'nowrap' } },
          }}
          onClick={() => {
            setOpen(false);
            onCreate();
          }}
        />
        <SpeedDialAction
          icon={<QrCodeScannerIcon />}
          slotProps={{
            tooltip: () => ({ title: 'Scan book', open: true }),
            staticTooltipLabel: { sx: { whiteSpace: 'nowrap' } },
          }}
          onClick={() => {
            setOpen(false);
            navigate('/scan');
          }}
        />
      </SpeedDial>
    </ClickAwayListener>
  );
}
