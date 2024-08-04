import { FormControl, Select, SelectChangeEvent } from '@mui/material';

type SmallSelectProps = {
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  children: React.ReactNode;
};

export default function SmallSelect({ value, onChange, children }: SmallSelectProps) {
  return (
    <FormControl size="small">
      <Select native value={value} onChange={onChange}>
        {children}
      </Select>
    </FormControl>
  );
}
