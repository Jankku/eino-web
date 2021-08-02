import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../axios';
import useToken from '../../utils/useToken';
import Header from '../Header';

const useStyles = makeStyles((theme) =>
  createStyles({
    item: {
      backgroundColor: theme.palette.background.paper,
    },
    itemText: {
      padding: '0.5em 0em 0em 0.5em',
      color: theme.palette.text.primary,
    },
    cardActionsContainer: {
      padding: '1em 0em 0em 0em',
      color: theme.palette.text.primary,
    },
    cardActions: {
      color: theme.palette.text.primary,
    },
  })
);

export default function BookDetail(props) {
  const classes = useStyles();
  const history = useHistory();
  const { token } = useToken();

  const [book, setBook] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios({
          method: 'get',
          url: `/api/list/books/book/${props.computedMatch.params.bookId}`,
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        setBook(res.data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookDetails();
  }, [props.computedMatch.params.bookId, token]);

  const deleteBook = async () => {
    try {
      await axios({
        method: 'delete',
        url: `/api/list/books/delete/${props.computedMatch.params.bookId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      history.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        {book.length !== 0 ? (
          book.map((book, bookIdx) => (
            <div key={bookIdx}>
              <h1>{book.title}</h1>
              <Card className={classes.item}>
                <CardContent>
                  <Typography variant="subtitle2" component="div">
                    ISBN: {book.isbn}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Author: {book.author}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Publisher: {book.publisher}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Year: {book.year}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Pages: {book.pages}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Status: {book.status}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Score: {book.score}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Start date: {book.start_date}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    End date: {book.end_date}
                  </Typography>
                  <Typography variant="subtitle2" component="div">
                    Item created on: {book.created_on}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={deleteBook}>Delete</Button>
                </CardActions>
              </Card>
            </div>
          ))
        ) : (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        )}
      </Container>
    </>
  );
}
