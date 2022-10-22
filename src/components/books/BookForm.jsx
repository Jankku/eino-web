import { Grid, InputLabel, Select, TextField, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import score from '../../models/score';
import bookStatus from '../../models/bookStatus';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DateTime } from 'luxon';

function BookForm({ formData, handleChange, handleDateChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          name="pages"
          label="Pages"
          value={formData.pages}
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
          name="year"
          label="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <Grid container sx={{ marginTop: '1em' }} justifyContent="space-between">
          <DatePicker
            disableMaskedInput
            name="start_date"
            label="Start date"
            value={formData.start_date}
            onChange={(date) => handleDateChange('start_date', DateTime.fromISO(date).toISODate())}
            renderInput={(props) => (
              <TextField fullWidth={isMobile} sx={{ mb: '1em' }} {...props} />
            )}
          />
          <DatePicker
            disableMaskedInput
            name="end_date"
            label="End date"
            value={formData.end_date}
            onChange={(date) => handleDateChange('end_date', DateTime.fromISO(date).toISODate())}
            renderInput={(props) => <TextField fullWidth={isMobile} {...props} />}
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
