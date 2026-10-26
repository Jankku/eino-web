import { Controller, useFormContext } from 'react-hook-form';
import {
  DateTimePicker as MUIDateTimepicker,
  DateTimePickerProps as MUIDateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { DateTime } from 'luxon';

interface DateTimePickerProps extends Omit<
  MUIDateTimePickerProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'inputRef'
> {
  name: string;
  label: string;
  fullWidth?: boolean;
}

export default function DateTimePicker({
  name,
  label,
  slotProps,
  fullWidth = true,
  ...rest
}: DateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange, onBlur, ref }, fieldState: { error } }) => (
        <MUIDateTimepicker
          ampm={false}
          {...rest}
          name={name}
          value={typeof value === 'string' && value ? DateTime.fromISO(value) : null}
          onChange={(date) => onChange(DateTime.fromISO(date as unknown as string).toISO())}
          label={label}
          inputRef={ref}
          slotProps={{
            ...slotProps,
            textField: (ownerState) => {
              const textFieldProps =
                typeof slotProps?.textField === 'function'
                  ? slotProps.textField(ownerState)
                  : slotProps?.textField;

              return {
                fullWidth,
                ...textFieldProps,
                ...(error && { error: true, helperText: error.message }),
                onBlur: (event) => {
                  onBlur();
                  textFieldProps?.onBlur?.(event);
                },
              };
            },
          }}
          sx={{ width: '100%', py: 1 }}
        />
      )}
    />
  );
}
