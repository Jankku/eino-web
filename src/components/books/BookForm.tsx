import { Grid, IconButton, InputAdornment } from '@mui/material';
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
      <Grid container>
        <TextField margin="dense" name="title" label="Title" />
        <TextField margin="dense" name="author" label="Author" />
        <TextField margin="dense" name="publisher" label="Publisher" />
        <TextField margin="dense" name="isbn" label="ISBN" />
        <TextField
          margin="dense"
          name="image_url"
          label="Cover URL"
          placeholder='Click the "+" button to search for covers'
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Search cover" onClick={onShowCovers}>
                  <AddCircle />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField multiline minRows={2} maxRows={5} margin="dense" name="note" label="Note" />
        <Grid
          container
          sx={{
            gap: 1,
          }}
        >
          <Grid
            item
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="pages" label="Pages" />
          </Grid>
          <Grid
            item
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="year" label="Released" />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <DatePicker name="start_date" label="Start date" sx={{ marginTop: 1, flexGrow: 1 }} />
          <DatePicker name="end_date" label="End date" sx={{ marginTop: 1, flexGrow: 1 }} />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: 'space-between',
          mt: 2,
          gap: 1,
        }}
      >
        <Grid item>
          <Select name="score" label="Score">
            {score.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </Grid>
        <Grid item flexGrow={2}>
          <LanguageAutocomplete name="language_code" label="Language" />
        </Grid>
        <Grid item>
          <Select name="status" label="Status">
            {bookStatus.map((item, itemIdx) => {
              return (
                <option key={itemIdx} value={item.value}>
                  {item.name}
                </option>
              );
            })}
          </Select>
        </Grid>
      </Grid>
    </>
  );
}
