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
import { useHistory } from 'react-router-dom';
import EditMovieDialog from './EditMovieDialog';
import ColumnCalculator from '../../utils/ColumnCalculator';

const PREFIX = 'MovieList';

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

export default function MovieList({ movies, fetchMovies }) {
  const history = useHistory();

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedMovieId, seteditedMovieId] = useState('');

  const handleEditDialogOpen = () => setEditDialogVisible(true);
  const handleEditDialogCancel = () => setEditDialogVisible(false);

  return (
    <Root>
      <ImageList cols={ColumnCalculator()} rowHeight={155}>
        {movies.map((movie, movieIdx) => (
          <ImageListItem key={movieIdx}>
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
                        {movie.title.length > 0 ? movie.title : '-'}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        className={classes.itemText}
                      >
                        {movie.studio.length > 0 ? movie.studio : '-'}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2" component="div">
                        {movie.score}
                      </Typography>
                      <Typography variant="subtitle2" component="div">
                        {capitalize(movie.status)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardActions className={classes.cardActionsContainer}>
                    <Button
                      className={classes.cardActions}
                      onClick={() => history.push(`/movies/${movie.movie_id}`)}
                    >
                      Details
                    </Button>

                    <Button
                      onClick={() => {
                        handleEditDialogOpen();
                        seteditedMovieId(movie.movie_id);
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

      <EditMovieDialog
        visible={editDialogVisible}
        closeDialog={handleEditDialogCancel}
        movieId={editedMovieId}
        submitAction={fetchMovies}
      />
    </Root>
  );
}
