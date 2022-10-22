import { Grid, InputLabel, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import score from '../../models/score';
import movieStatus from '../../models/movieStatus';
import { Box } from '@mui/system';
import { DateTime } from 'luxon';

function MovieForm({ formData, handleChange, handleDateChange }) {
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
          name="duration"
          label="Duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="year"
          label="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <Grid container sx={{ marginTop: '1em' }} justifyContent="space-between">
          <Box sx={{ marginBottom: '1em' }}>
            <DatePicker
              disableMaskedInput
              name="start_date"
              label="Start date"
              value={formData.start_date}
              onChange={(date) =>
                handleDateChange('start_date', DateTime.fromISO(date).toISODate())
              }
              renderInput={(props) => <TextField {...props} />}
            />
          </Box>
          <Box>
            <DatePicker
              disableMaskedInput
              name="end_date"
              label="End date"
              value={formData.end_date}
              onChange={(date) => handleDateChange('end_date', DateTime.fromISO(date).toISODate())}
              renderInput={(props) => <TextField {...props} />}
            />
          </Box>
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
