import React from 'react';
import { Box } from '@material-ui/system';
import { Link } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const PREFIX = 'Footer';
const classes = {
  link: `${PREFIX}-link`,
};

const Root = styled('div')(() => ({
  [`& .${classes.link}`]: {
    textDecoration: 'underline',
    textDecorationThickness: '2px',
  },
}));

export default function Footer() {
  return (
    <Root>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <p>Made by Jankku ✨</p>
        <Link
          href="https://github.com/Jankku/eino-web"
          target="_blank"
          rel="noreferrer"
          className={classes.link}
          sx={{ color: 'text.link' }}
        >
          Github
        </Link>
      </Box>
    </Root>
  );
}
