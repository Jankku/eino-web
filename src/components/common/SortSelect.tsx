import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import SmallSelect from './SmallSelect';

type SortSelectProps = {
  fieldOptions: { name: string; value: string }[];
  onChange: (params: { sort: string; order: string }) => void;
};

export default function SortSelect({ fieldOptions, onChange }: SortSelectProps) {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'title';
  const order = searchParams.get('order') || 'ascending';

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        width: { xs: '100%', sm: 'auto' },
        maxWidth: '100%',
        '& .MuiFormControl-root': { minWidth: 0, maxWidth: 220, flex: 1 },
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        aria-hidden="true"
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        Sort by
      </Typography>
      <SmallSelect
        compact
        label="Sort by"
        value={`${sort}:${order}`}
        onChange={(event) => {
          const [nextSort, nextOrder] = event.target.value.split(':');
          onChange({ sort: nextSort, order: nextOrder });
        }}
      >
        {fieldOptions.map((field) => {
          const alphabetical = [
            'title',
            'author',
            'publisher',
            'status',
            'studio',
            'director',
            'writer',
          ].includes(field.value);
          const date = ['year', 'start_date', 'end_date', 'created_on'].includes(field.value);
          return (
            <optgroup key={field.value} label={field.name}>
              <option value={`${field.value}:ascending`}>
                {field.name} · {alphabetical ? 'A–Z' : date ? 'Oldest first' : 'Low–High'}
              </option>
              <option value={`${field.value}:descending`}>
                {field.name} · {alphabetical ? 'Z–A' : date ? 'Newest first' : 'High–Low'}
              </option>
            </optgroup>
          );
        })}
      </SmallSelect>
    </Stack>
  );
}
