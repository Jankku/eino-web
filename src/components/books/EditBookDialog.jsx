import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import bookStatus from '../../models/bookStatus';
import score from '../../models/score';
import initialBookFormState from '../../models/initialBookFormState';
import { Box } from '@mui/system';
import DatePicker from '@mui/lab/DatePicker';
import BookController from '../../data/BookController';
import { DateTime } from 'luxon';

const PREFIX = 'EditBookDialog';

const classes = {
  select: `${PREFIX}-select`,
};

const StyledDialog = styled(Dialog)({
  [`& .${classes.select}`]: {
    marginTop: '1em',
    paddingLeft: '0.5em',
  },
});

export default function EditBookDialog({
  visible,
  closeDialog,
  bookId,
  submitAction,
}) {
  const [formData, setFormData] = useState(initialBookFormState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        setLoading(true);

        const res = await BookController.getBookDetails(bookId);
        setFormData(res.data.results[0]);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (visible === true) getFormData();
  }, [bookId, visible]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialBookFormState);
  };

  const submitForm = async () => {
    try {
      await BookController.updateBook(bookId, formData);
      submitAction();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledDialog open={visible}>
      <DialogTitle>Edit book</DialogTitle>
      {!isLoading ? (
        <DialogContent>
          <TextField
            autoFocus
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
          <Grid container>
            <Box sx={{ margin: '1em 0em 1em 0em' }}>
              <DatePicker
                name="start_date"
                label="Start date"
                value={formData.start_date}
                onChange={(date) =>
                  handleDateChange(
                    'start_date',
                    DateTime.fromMillis(Number(date)).toUTC().toISODate()
                  )
                }
                renderInput={(props) => <TextField {...props} />}
              />
            </Box>
            <Box sx={{ margin: '1em 0em 0em 1em' }}>
              <DatePicker
                name="end_date"
                label="End date"
                value={formData.end_date}
                onChange={(date) =>
                  handleDateChange(
                    'end_date',
                    DateTime.fromMillis(Number(date)).toUTC().toISODate()
                  )
                }
                renderInput={(props) => <TextField {...props} />}
              />
            </Box>
          </Grid>
          <Grid container>
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
              <Box sx={{ marginLeft: '1em' }}>
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
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      )}
      <DialogActions>
        <Button
          color="secondary"
          onClick={() => {
            closeDialog();
            clearForm();
          }}
        >
          Cancel
        </Button>
        {
          // Disable button while loading
          !isLoading ? (
            <Button
              color="primary"
              onClick={() => {
                submitForm();
                closeDialog();
              }}
            >
              Submit changes
            </Button>
          ) : (
            <Button
              disabled
              color="primary"
              onClick={() => {
                submitForm();
                closeDialog();
              }}
            >
              Submit changes
            </Button>
          )
        }
      </DialogActions>
    </StyledDialog>
  );
}
