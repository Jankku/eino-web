import { useId } from 'react';
import {
  Checkbox as MUICheckbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type CheckboxProps = {
  name: string;
  label: string;
};

export default function Checkbox({ name, label }: CheckboxProps) {
  const { control } = useFormContext();
  const errorId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, ...field }, fieldState: { invalid, error } }) => (
        <FormControl error={invalid}>
          <FormControlLabel
            control={
              <MUICheckbox
                {...field}
                checked={!!value}
                slotProps={{
                  input: {
                    ref,
                    'aria-invalid': invalid,
                    'aria-describedby': error?.message ? errorId : undefined,
                  },
                }}
              />
            }
            label={label}
          />
          {error?.message ? <FormHelperText id={errorId}>{error.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
