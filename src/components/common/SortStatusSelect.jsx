import { FormControl, Select } from '@mui/material';

function SortStatusSelect({ status, onChange, children }) {
  return (
    <FormControl size="small">
      <Select
        native
        value={status}
        inputProps={{ name: 'sortStatus', id: 'sortStatus' }}
        onChange={onChange}
      >
        {children}
      </Select>
    </FormControl>
  );
}

export default SortStatusSelect;
