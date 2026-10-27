import { IconButton, InputAdornment, Stack, Box } from '@mui/material';
import { score } from '../../models/score';
import { bookStatus } from '../../models/bookStatus';
import AddCircle from '@mui/icons-material/AddCircle';
import TextField from '../form/TextField';
import DatePicker from '../form/DatePicker';
import Select from '../form/Select';
import LanguageAutocomplete from '../form/LanguageAutocomplete';

type BookFormProps = {
  onShowCovers: () => void;
};

export default function BookForm({ onShowCovers }: BookFormProps) {
  return (
    <>
      <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%' }}>
        <TextField margin="dense" name="title" label="Title" />
        <TextField margin="dense" name="author" label="Author" />
        <TextField margin="dense" name="publisher" label="Publisher" />
        <TextField margin="dense" name="isbn" label="ISBN" />
        <TextField
          margin="dense"
          name="image_url"
          label="Cover URL"
          placeholder='Click the "+" button to search for covers'
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Search cover" onClick={onShowCovers}>
                    <AddCircle />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField multiline minRows={2} maxRows={5} margin="dense" name="note" label="Note" />
        <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%', gap: 1 }}>
          <Box
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="pages" label="Pages" />
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
        sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', mt: 2, gap: 1 }}
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
        <Box sx={{ flexGrow: 2 }}>
          <LanguageAutocomplete name="language_code" label="Language" />
        </Box>
        <Box>
          <Select name="status" label="Status">
            {bookStatus.map((item) => {
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
