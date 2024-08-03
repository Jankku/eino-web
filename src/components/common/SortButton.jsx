import { Popover, Stack } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SmallSelect from './SmallSelect';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResponsiveButton from './ResponsiveButton';

export default function SortButton({ fieldOptions, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelectChange = (key, value) => {
    onChange({ key, value });
  };

  return (
    <>
      <ResponsiveButton icon={<SwapVertIcon />} onClick={handleClick}>
        Sort
      </ResponsiveButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack direction="row" p={2} spacing={2}>
          <SmallSelect
            value={searchParams.get('sort')}
            onChange={(e) => onSelectChange('sort', e.target.value)}
          >
            {fieldOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.name}
              </option>
            ))}
          </SmallSelect>
          <SmallSelect
            value={searchParams.get('order')}
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
