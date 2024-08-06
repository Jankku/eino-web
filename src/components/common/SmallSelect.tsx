import { FormControl, Select, SelectChangeEvent } from '@mui/material';

type SmallSelectProps = {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  children: React.ReactNode;
};

export default function SmallSelect({ label, value, onChange, children }: SmallSelectProps) {
  return (
    <FormControl size="small">
      <Select native inputProps={{ 'aria-label': label }} value={value} onChange={onChange}>
        {children}
      </Select>
    </FormControl>
  );
}
