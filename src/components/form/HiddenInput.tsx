import { Controller, useFormContext } from 'react-hook-form';

type HiddenInputProps = {
  name: string;
};

export default function HiddenInput({ name }: HiddenInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <input {...field} type="hidden" />}
    />
  );
}
