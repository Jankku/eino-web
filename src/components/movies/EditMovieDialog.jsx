import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
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
} from '@material-ui/core';
import movieStatus from '../../models/movieStatus';
import score from '../../models/score';
import initialMovieFormState from '../../models/initialMovieFormState';
import useToken from '../../utils/useToken';
import { Box } from '@material-ui/system';
import DatePicker from '@material-ui/lab/DatePicker';
import MovieController from '../../data/MovieController';

const PREFIX = 'EditMovieDialog';

const classes = {
  select: `${PREFIX}-select`,
};

const StyledDialog = styled(Dialog)({
  [`& .${classes.select}`]: {
    marginTop: '1em',
    paddingLeft: '0.5em',
  },
});

export default function EditMovieDialog({
  visible,
  closeDialog,
  movieId,
  submitAction,
}) {
  const { token } = useToken();
  const [formData, setFormData] = useState(initialMovieFormState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        setLoading(true);

        const res = await MovieController.getMovieDetails(movieId, token);
        setFormData(res.data.results[0]);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (visible === true) getFormData();
  }, [movieId, visible, token]);

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
      await MovieController.updateMovie(movieId, token, formData);
      submitAction();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledDialog open={visible}>
      <DialogTitle>Edit movie</DialogTitle>
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
