import { IconButton, Menu, MenuItem } from '@mui/material';
import { useId, useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';

type MoreButtonProps = {
  actions: { label: string; onClick: () => void; disabled?: boolean }[];
};

export default function MoreButton({ actions }: MoreButtonProps) {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        id={`${id}-trigger`}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        variant="menu"
        slotProps={{
          list: () => ({ component: 'ul', id: `${id}-menu`, 'aria-labelledby': `${id}-trigger` }),
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            disabled={action.disabled}
            onClick={() => {
              setAnchorEl(null);
              action.onClick();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
