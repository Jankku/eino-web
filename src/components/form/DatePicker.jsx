import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker as MUIDatepicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';

export default function DatePicker({ name, label, ...rest }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onChange, ref }, fieldState: { error } }) => (
        <MUIDatepicker
          {...rest}
          defaultValue={DateTime.now().toISO()}
          value={DateTime.fromISO(value) ?? null}
          onChange={(date) => onChange(DateTime.fromISO(date).toISO())}
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
