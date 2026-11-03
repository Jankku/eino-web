import { FormControl, Select, SelectChangeEvent } from '@mui/material';

type SmallSelectProps = {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  children: React.ReactNode;
  compact?: boolean;
};

export default function SmallSelect({
  label,
  value,
  onChange,
  children,
  compact = false,
}: SmallSelectProps) {
  return (
    <FormControl size="small">
      <Select
        native
        inputProps={{ 'aria-label': label }}
        value={value}
        onChange={onChange}
        sx={
          compact
            ? {
                height: 32,
                fontSize: '0.875rem',
                '& .MuiNativeSelect-select': { py: 0.75, pl: 1.25 },
              }
            : undefined
        }
      >
        {children}
      </Select>
    </FormControl>
  );
}
