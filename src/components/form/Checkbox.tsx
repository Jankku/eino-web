import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type HiddenInputProps = {
  name: string;
  label: string;
};

export default function Checkbox({ name, label }: HiddenInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel control={<MUICheckbox {...field} name={name} />} label={label} />
      )}
    />
  );
}
