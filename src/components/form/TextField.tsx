import { Controller, useFormContext } from 'react-hook-form';
import { TextField as MUITextField } from '@mui/material';

type TextFieldProps = {
  name: string;
  label: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  helperText?: string;
  [key: string]: unknown;
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => (
        <MUITextField
          {...field}
          {...rest}
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
