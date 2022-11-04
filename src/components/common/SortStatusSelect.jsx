import { Select } from '@mui/material';

function SortStatusSelect({ status, onChange, children }) {
  return (
    <Select
      native
      value={status}
      inputProps={{ name: 'sortStatus', id: 'sortStatus' }}
      onChange={onChange}
    >
      {children}
    </Select>
  );
}

export default SortStatusSelect;
