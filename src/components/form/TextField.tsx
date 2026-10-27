import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';

type TextFieldProps = Omit<MUITextFieldProps, 'name'> & {
  name: string;
  label: string;
};

export default function TextField({
  name,
  label,
  type = 'text',
  autoFocus = false,
  autoComplete = 'on',
  helperText,
  ...rest
}: TextFieldProps) {
  const { control } = useFormContext();
  const generatedId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <MUITextField
          {...field}
          inputRef={ref}
          {...rest}
          id={rest.id ?? generatedId}
          fullWidth
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          variant="outlined"
          color="primary"
          type={type}
          label={label}
          error={invalid}
          helperText={error?.message || helperText}
        />
      )}
    />
  );
}
