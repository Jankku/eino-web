import { Popover, Stack } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SmallSelect from './SmallSelect';
import React, { useId, useState } from 'react';
import { useSearchParams } from 'react-router';
import ResponsiveButton from './ResponsiveButton';

type SortButtonProps = {
  fieldOptions: { name: string; value: string }[];
  onChange: (params: { key: string; value: string }) => void;
};

export default function SortButton({ fieldOptions, onChange }: SortButtonProps) {
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [searchParams] = useSearchParams();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelectChange = (key: string, value: string) => {
    onChange({ key, value });
  };

  return (
    <>
      <ResponsiveButton
        id={`${id}-trigger`}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchorEl)}
        aria-controls={anchorEl ? `${id}-dialog` : undefined}
        icon={<SwapVertIcon />}
        onClick={(e) => handleClick(e)}
      >
        Sort
      </ResponsiveButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          transition: {
            onEntering: (paper) => paper.querySelector<HTMLSelectElement>('select')?.focus(),
          },
          paper: () => ({
            component: 'div',
            id: `${id}-dialog`,
            role: 'dialog',
            'aria-modal': true,
            'aria-labelledby': `${id}-trigger`,
          }),
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <SmallSelect
            label="Sort by"
            value={searchParams.get('sort')!}
            onChange={(e) => onSelectChange('sort', e.target.value)}
          >
            {fieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </SmallSelect>
          <SmallSelect
            label="Order"
            value={searchParams.get('order')!}
            onChange={(e) => onSelectChange('order', e.target.value)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </SmallSelect>
        </Stack>
      </Popover>
    </>
  );
}
