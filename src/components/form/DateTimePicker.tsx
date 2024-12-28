import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker as MUIDateTimepicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTime } from 'luxon';

interface DatePickerProps {
  name: string;
  label: string;
  [key: string]: unknown;
}

export default function DateTimePicker({ name, label, ...rest }: DatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
        <MUIDateTimepicker
          {...rest}
          ampm={false}
          value={DateTime.fromISO(value) ?? null}
          onChange={(date) => onChange(DateTime.fromISO(date as unknown as string).toISO())}
          label={label}
          inputRef={ref}
          slotProps={{
            textField: {
              name,
              error: !!error,
              helperText: error?.message,
            },
          }}
          sx={{ width: '100%', py: 1 }}
        />
      )}
    />
  );
}
