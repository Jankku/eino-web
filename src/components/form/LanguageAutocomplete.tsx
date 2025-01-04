import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Language, languages } from '../../utils/languages';
import HiddenInput from './HiddenInput';

const filterOptions = createFilterOptions<Language>({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: ({ englishName, nativeName }) => `${englishName} ${nativeName}`,
  trim: true,
});

type AutoCompleteProps = {
  name: string;
  label: string;
  [key: string]: unknown;
};

export default function LanguageAutocomplete({ name, label, ...rest }: AutoCompleteProps) {
  const { control, getValues, setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    () => languages.find((l) => l.code === getValues('language_code'))?.englishName ?? '',
  );
  const [selectedItem, setSelecteditem] = useState<Language | null>(
    () => languages.find((l) => l.code === getValues('language_code')) ?? null,
  );

  return (
    <>
      <HiddenInput name="language_code" />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...rest}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            options={languages}
            value={selectedItem}
            isOptionEqualToValue={(option, value) => option?.code === value?.code}
            onChange={(_event, newValue, reason) => {
              if (['selectOption'].includes(reason)) {
                setSelecteditem(newValue as Language);
                setValue('language_code', (newValue as Language)?.code);
              }
              if (reason === 'clear') {
                setSelecteditem(null);
                setValue('language_code', null);
              }
            }}
            filterOptions={filterOptions}
            getOptionLabel={(option) => option?.englishName ?? ''}
            inputValue={String(searchTerm)}
            onInputChange={(_e, value, reason) => {
              if (['input', 'selectOption'].includes(reason)) setSearchTerm(value ?? '');
              if (['clear', 'reset'].includes(reason)) setSearchTerm('');
            }}
            renderInput={(params) => <TextField {...params} {...field} name="" label={label} />}
          />
        )}
      />
    </>
  );
}
