import React, { useState } from 'react';
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
import { makeStyles } from '@material-ui/styles';
import axios from '../../axios';
import bookStatus from '../../models/bookStatus';
import score from '../../models/score';
import initialBookFormState from '../../models/initialBookFormState';
import useToken from '../../utils/useToken';
import { useEffect } from 'react';

const useStyles = makeStyles({
  select: {
    marginTop: '1em',
    paddingLeft: '0.5em',
  },
});

export default function EditBookDialog({
  visible,
  closeDialog,
  bookId,
  fetchBooks,
}) {
  const classes = useStyles();
  const { token } = useToken();

  const [formData, setFormData] = useState(initialBookFormState);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        setLoading(true);

        const res = await axios({
          method: 'get',
          url: `/api/list/books/book/${bookId}`,
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        setFormData(res.data.results[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (visible === true) getFormData();
  }, [bookId, visible, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData(initialBookFormState);
  };

  const submitForm = async () => {
    try {
      await axios({
        method: 'put',
        url: `/api/list/books/update/${bookId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
        data: formData,
      });

      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={visible}>
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
            name="year"
            label="Year"
            value={formData.year}
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
            name="Start date"
            label="Start date"
            value={formData.start_date}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="end_date"
            label="End date"
            value={formData.end_date}
            onChange={handleChange}
          />
          <Grid container={true}>
            <Grid item={true} className={classes.select}>
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
            <Grid item={true} className={classes.select}>
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
        {!isLoading ? (
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
        )}
      </DialogActions>
    </Dialog>
  );
}
