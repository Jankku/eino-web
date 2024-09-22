import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
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
                    aria-label="toggle password visibility"
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
