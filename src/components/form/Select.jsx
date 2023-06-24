import { Controller, useFormContext } from 'react-hook-form';
import { Select as MUISelect, InputLabel } from '@mui/material';

export default function Select({ name, label, children, ...rest }) {
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
