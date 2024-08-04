import { Controller, useFormContext } from 'react-hook-form';
import { Select as MUISelect, InputLabel } from '@mui/material';

type SelectProps = {
  name: string;
  label: string;
  children: React.ReactNode;
};

export default function Select({ name, label, children, ...rest }: SelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <MUISelect {...field} {...rest} native inputProps={{ name, id: name }}>
            {children}
          </MUISelect>
        </>
      )}
    />
  );
}
