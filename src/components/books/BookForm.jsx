import { Grid, IconButton, InputAdornment, InputLabel, Select, TextField } from '@mui/material';
import { Unstable_NextDatePicker as DatePicker } from '@mui/x-date-pickers/NextDatePicker';
import score from '../../models/score';
import bookStatus from '../../models/bookStatus';
import { DateTime } from 'luxon';
import AddCircle from '@mui/icons-material/AddCircle';

function BookForm({ formData, handleChange, handleDateChange, setShowCovers }) {
  return (
    <>
      <Grid container>
        <TextField
          fullWidth
          margin="dense"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="author"
          label="Author"
          value={formData.author}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="publisher"
          label="Publisher"
          value={formData.publisher}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="isbn"
          label="ISBN"
          value={formData.isbn}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="image_url"
          label="Cover URL"
          placeholder='Click the "+" button to search for covers'
          value={formData.image_url}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCovers(true)}>
                  <AddCircle />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Grid container gap={1} justifyContent="space-between">
          <TextField
            type="number"
            margin="dense"
            name="pages"
            label="Pages"
            value={formData.pages}
            onChange={handleChange}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            type="number"
            margin="dense"
            name="year"
            label="Year"
            value={formData.year}
            onChange={handleChange}
            sx={{ flexGrow: 1 }}
          />
        </Grid>
        <Grid container gap={1} justifyContent="space-between">
          <DatePicker
            name="start_date"
            label="Start date"
            value={DateTime.fromISO(formData.start_date)}
            onChange={(date) => handleDateChange('start_date', DateTime.fromISO(date).toISODate())}
            renderInput={(props) => <TextField {...props} />}
            sx={{ marginTop: 1, flexGrow: 1 }}
          />
          <DatePicker
            name="end_date"
            label="End date"
            value={DateTime.fromISO(formData.end_date)}
            onChange={(date) => handleDateChange('end_date', DateTime.fromISO(date).toISODate())}
            renderInput={(props) => <TextField {...props} />}
            sx={{ marginTop: 1, flexGrow: 1 }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item>
          <InputLabel htmlFor="score">Score</InputLabel>
          <Select
            native
            value={formData.score}
            inputProps={{ name: 'score', id: 'score' }}
            onChange={handleChange}
          >
            {score.map((item, itemIdx) => (
              <option key={itemIdx} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <InputLabel htmlFor="status">Status</InputLabel>
          <Select
            native
            value={formData.status}
            inputProps={{ name: 'status', id: 'status' }}
            onChange={handleChange}
          >
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

export default BookForm;
