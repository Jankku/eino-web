import { IconButton, Popover } from '@mui/material';
import React, { useState } from 'react';
import MoreVert from '@mui/icons-material/MoreVert';

type MoreButtonProps = {
  children: React.ReactNode;
};

export default function MoreButton({ children }: MoreButtonProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="More actions" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          {children}
        </div>
      </Popover>
    </>
  );
}
