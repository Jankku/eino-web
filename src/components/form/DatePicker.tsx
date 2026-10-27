import { Controller, useFormContext } from 'react-hook-form';
import {
  DatePicker as MUIDatepicker,
  DatePickerProps as MUIDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';

interface DatePickerProps extends Omit<
  MUIDatePickerProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'inputRef'
> {
  name: string;
  label: string;
}

export default function DatePicker({ name, label, slotProps, ...rest }: DatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange, onBlur, ref }, fieldState: { error } }) => (
        <MUIDatepicker
          {...rest}
          name={name}
          value={value ? DateTime.fromISO(value) : null}
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
                ...textFieldProps,
                ...(error && { error: true, helperText: error.message }),
                onBlur: (event) => {
                  onBlur();
                  textFieldProps?.onBlur?.(event);
                },
              };
            },
          }}
        />
      )}
    />
  );
}
