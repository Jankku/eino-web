import { Grid, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
const PREFIX = 'BookDetailItem';

const classes = {
  item: `${PREFIX}-item`,
  title: `${PREFIX}-title`,
  text: `${PREFIX}-text`
};

const Root = styled('div')({
  [`&.${classes.item}`]: {
    padding: '0.5rem',
    margin: '0.1em',
  },
  [`& .${classes.title}`]: {
    fontWeight: 700,
  },
  [`& .${classes.text}`]: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '15em',
  },
});

export default function BookDetailItem({ title, text }) {


  return (
    <Root className={classes.item}>
      <Grid item justifyContent="center">
        <Grid item>
          <Typography
            variant="body1"
            className={classes.title}
          >{`${title}`}</Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="body2"
            className={classes.text}
          >{`${text}`}</Typography>
        </Grid>
      </Grid>
    </Root>
  );
}
