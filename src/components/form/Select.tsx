import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Select as MUISelect,
  SelectProps as MUISelectProps,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';

type SelectProps = Omit<
  MUISelectProps,
  'name' | 'label' | 'value' | 'defaultValue' | 'onChange' | 'inputRef' | 'native'
> & {
  name: string;
  label: string;
  helperText?: string;
};

export default function Select({
  name,
  label,
  children,
  helperText,
  id,
  inputProps,
  ...rest
}: SelectProps) {
  const { control } = useFormContext();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper-text`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <FormControl fullWidth error={invalid} disabled={rest.disabled} required={rest.required}>
          <InputLabel htmlFor={inputId}>{label}</InputLabel>
          <MUISelect
            {...field}
            {...rest}
            inputRef={ref}
            native
            label={label}
            error={invalid}
            inputProps={{
              ...inputProps,
              name,
              id: inputId,
              'aria-invalid': invalid,
              'aria-describedby':
                [inputProps?.['aria-describedby'], (error?.message || helperText) && helperId]
                  .filter(Boolean)
                  .join(' ') || undefined,
            }}
          >
            {children}
          </MUISelect>
          {error?.message || helperText ? (
            <FormHelperText id={helperId}>{error?.message || helperText}</FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  );
}
