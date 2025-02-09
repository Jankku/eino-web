import { Grid, IconButton, InputAdornment } from '@mui/material';
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
      <Grid container>
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
        <Grid
          container
          sx={{
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <Grid
            item
            sx={{
              flexGrow: 2,
            }}
          >
            <TextField type="number" margin="dense" name="duration" label="Duration in minutes" />
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
        <Grid item>
          <Select name="status" label="Status">
            {movieStatus.map((item, itemIdx) => {
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
