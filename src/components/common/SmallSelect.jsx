import { FormControl, Select } from '@mui/material';

export default function SmallSelect({ value, onChange, children }) {
  return (
    <FormControl size="small">
      <Select native value={value} onChange={onChange}>
        {children}
      </Select>
    </FormControl>
  );
}
