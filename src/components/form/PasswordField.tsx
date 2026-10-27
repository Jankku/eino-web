import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useId, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type PasswordFieldProps = {
  name: string;
  label: string;
  autoFocus?: boolean;
  autoComplete?: string;
  helperText?: string;
};

export default function PasswordField({
  name,
  label,
  autoFocus = false,
  autoComplete = 'current-password',
  helperText,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext();
  const generatedId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          inputRef={ref}
          id={generatedId}
          fullWidth
          autoFocus={autoFocus}
          variant="outlined"
          color="primary"
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          autoCapitalize="none"
          label={label}
          error={invalid}
          helperText={error?.message || helperText}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
