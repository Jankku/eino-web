import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fade,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import EditBookDialog from './EditBookDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';

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

export default function BookList({ books, fetchBooks }) {
  const classes = useStyles();
  const history = useHistory();

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedBookId, seteditedBookId] = useState('');

  const handleEditDialogOpen = () => {
    setEditDialogVisible(true);
  };

  const handleEditDialogCancel = () => {
    setEditDialogVisible(false);
  };

  return (
    <div>
      <ImageList cols={ColumnCalculator()} rowHeight={155}>
        {books.map((book, bookIdx) => (
          <ImageListItem key={bookIdx}>
            <Fade in={true}>
              <Card className={classes.item}>
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography
                        variant="body1"
                        component="div"
                        className={classes.itemText}
                      >
                        {book.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        className={classes.itemText}
                      >
                        {book.author}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2" component="div">
                        {book.score}
                      </Typography>
                      <Typography variant="subtitle2" component="div">
                        {book.status}
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardActions className={classes.cardActionsContainer}>
                    <Button
                      onClick={() => history.push(`/books/${book.book_id}`)}
                      className={classes.cardActions}
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => {
                        handleEditDialogOpen();
                        seteditedBookId(book.book_id);
                      }}
                      className={classes.cardActions}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Fade>
          </ImageListItem>
        ))}
      </ImageList>

      <EditBookDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        bookId={editedBookId}
        fetchBooks={fetchBooks}
      />
    </div>
  );
}
