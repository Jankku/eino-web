import { Grid, IconButton, InputAdornment, InputLabel, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import score from '../../models/score';
import movieStatus from '../../models/movieStatus';
import { DateTime } from 'luxon';
import { AddCircle } from '@mui/icons-material';

function MovieForm({ formData, handleChange, handleDateChange, setShowPosters }) {
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
          name="studio"
          label="Studio"
          value={formData.studio}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="director"
          label="Director"
          value={formData.director}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="writer"
          label="Writer"
          value={formData.writer}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="image_url"
          label="Poster URL"
          placeholder='Click the "+" button to search for posters'
          value={formData.image_url}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPosters(true)}>
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
            name="duration"
            label="Duration"
            value={formData.duration}
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
            sx={{ marginTop: 1, flexGrow: 1 }}
          />
          <DatePicker
            name="end_date"
            label="End date"
            value={DateTime.fromISO(formData.end_date)}
            onChange={(date) => handleDateChange('end_date', DateTime.fromISO(date).toISODate())}
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

export default MovieForm;
