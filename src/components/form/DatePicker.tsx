import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker as MUIDatepicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';

interface DatePickerProps {
  name: string;
  label: string;
  [key: string]: unknown;
}

export default function DatePicker({ name, label, ...rest }: DatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
        <MUIDatepicker
          {...rest}
          value={DateTime.fromISO(value) ?? null}
          onChange={(date) => onChange(DateTime.fromISO(date as unknown as string).toISO())}
          label={label}
          inputRef={ref}
          slotProps={{
            textField: {
              name,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  );
}
