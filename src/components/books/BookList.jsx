import React, { useState } from 'react';
import { styled } from '@mui/system';
import {
  Button,
  capitalize,
  Card,
  CardActions,
  CardContent,
  Fade,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditBookDialog from './EditBookDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';

const PREFIX = 'BookList';

const classes = {
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-itemText`,
  cardActionsContainer: `${PREFIX}-cardActionsContainer`,
  cardActions: `${PREFIX}-cardActions`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.item}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.itemText}`]: {
    padding: '0.5em 0em 0em 0.5em',
    color: theme.palette.text.primary,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '11em',
  },

  [`& .${classes.cardActionsContainer}`]: {
    padding: '1em 0em 0em 0em',
    color: theme.palette.text.primary,
  },

  [`& .${classes.cardActions}`]: {
    color: theme.palette.text.primary,
  },
}));

export default function BookList({ books, fetchBooks }) {
  const navigate = useNavigate();
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedBookId, seteditedBookId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Root>
      <ImageList cols={ColumnCalculator()} rowHeight={155} gap={4}>
        {books.map((book, bookIdx) => (
          <ImageListItem key={bookIdx}>
            <Fade in={true}>
              <Card
                className={classes.item}
                sx={{
                  border: 1,
                  borderColor: 'transparent',
                  borderRadius: 2,
                  ':hover': {
                    border: 1,
                    borderColor: 'primary.main',
                    borderRadius: 2,
                  },
                }}
              >
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography
                        variant="body1"
                        component="div"
                        className={classes.itemText}
                      >
                        {book.title.length > 0 ? book.title : '-'}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        className={classes.itemText}
                      >
                        {book.author.length > 0 ? book.author : '-'}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2" component="div">
                        {book.score}
                      </Typography>
                      <Typography variant="subtitle2" component="div">
                        {capitalize(book.status)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardActions className={classes.cardActionsContainer}>
                    <Button
                      className={classes.cardActions}
                      onClick={() => navigate(`/books/${book.book_id}`)}
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
        submitAction={fetchBooks}
      />
    </Root>
  );
}
