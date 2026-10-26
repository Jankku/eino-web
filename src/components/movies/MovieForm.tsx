import { IconButton, InputAdornment, Stack, Box } from '@mui/material';
import { score } from '../../models/score';
import { movieStatus } from '../../models/movieStatus';
import { AddCircle } from '@mui/icons-material';
import TextField from '../form/TextField';
import DatePicker from '../form/DatePicker';
import Select from '../form/Select';

type MovieFormProps = {
  onShowPosters: () => void;
};

export default function MovieForm({ onShowPosters }: MovieFormProps) {
  return (
    <>
      <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%' }}>
        <TextField margin="dense" name="title" label="Title" />
        <TextField margin="dense" name="studio" label="Studio" />
        <TextField margin="dense" name="director" label="Director" />
        <TextField margin="dense" name="writer" label="Writer" />
        <TextField
          margin="dense"
          name="image_url"
          label="Poster URL"
          placeholder='Click the "+" button to search for posters'
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Search cover" onClick={onShowPosters}>
                  <AddCircle />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField multiline minRows={2} maxRows={5} margin="dense" name="note" label="Note" />
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', width: '100%', gap: 1, justifyContent: 'space-between' }}
        >
          <Box
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="duration" label="Duration in minutes" />
          </Box>
          <Box
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="year" label="Released" />
          </Box>
        </Stack>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', width: '100%', gap: 1, justifyContent: 'space-between' }}
        >
          <DatePicker name="start_date" label="Started" sx={{ marginTop: 1, flexGrow: 1 }} />
          <DatePicker name="end_date" label="Finished" sx={{ marginTop: 1, flexGrow: 1 }} />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', mt: 2 }}
      >
        <Box>
          <Select name="score" label="Score">
            {score.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box>
          <Select name="status" label="Status">
            {movieStatus.map((item) => {
              return (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              );
            })}
          </Select>
        </Box>
      </Stack>
    </>
  );
}
