import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Select,
  TextField,
} from '@material-ui/core';
import DatePicker from '@material-ui/lab/DatePicker';
import axios from '../../axios';
import score from '../../models/score';
import movieStatus from '../../models/movieStatus';
import initialMovieFormState from '../../models/initialMovieFormState';
import useToken from '../../utils/useToken';
import { Box } from '@material-ui/system';

export default function AddMovieDialog({ visible, closeDialog, fetchMovies }) {
  const { token } = useToken();

  const [formData, setFormData] = useState(initialMovieFormState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialMovieFormState);
  };

  const submitForm = async () => {
    try {
      await axios({
        method: 'post',
        url: '/api/list/movies/add',
        headers: {
          Authorization: `bearer ${token}`,
        },
        data: formData,
      });

      // TODO: show success snackbar
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={visible}>
      <DialogTitle>Add new movie</DialogTitle>
      <DialogContent>
        <Grid container>
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
          <Grid container>
            <Box sx={{ margin: '1em 0em 1em 0em' }}>
              <DatePicker
                name="start_date"
                label="Start date"
                value={formData.start_date}
                onChange={(date) =>
                  handleDateChange('start_date', new Date(date))
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
                  handleDateChange('end_date', new Date(date))
                }
                renderInput={(props) => <TextField {...props} />}
              />
            </Box>
          </Grid>
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
                {movieStatus.map((item, itemIdx) => {
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
        <Button
          color="primary"
          onClick={() => {
            submitForm();
            closeDialog();
            clearForm();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
