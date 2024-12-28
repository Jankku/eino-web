import { Controller, useFormContext } from 'react-hook-form';
import { Select as MUISelect, InputLabel, FormControl } from '@mui/material';

type SelectProps = {
  name: string;
  label: string;
  children: React.ReactNode;
  [key: string]: unknown;
};

export default function Select({ name, label, children, ...rest }: SelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <MUISelect {...field} {...rest} native label={label} inputProps={{ name, id: name }}>
            {children}
          </MUISelect>
        </FormControl>
      )}
    />
  );
}
