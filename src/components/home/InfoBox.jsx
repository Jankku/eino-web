import { Box } from '@mui/system';
import React from 'react';
import { Button, Card, CardContent, Fade, Grid } from '@mui/material';

export default function InfoBox({ children }) {
  return (
    <Fade in={true} timeout={1000}>
      <Card
        sx={{
          padding: '0.2em',
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Grid
            container
            sx={{
              marginBottom: '0.3em',
              alignItems: 'center',
            }}
          >
            <Grid item>
              <Box
                sx={{
                  marginRight: '0.5em',
                  height: '24px',
                }}
              >
                {children.icon}
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  fontFamily: 'Pacifico, cursive',
                  fontSize: 'h6.fontSize',
                }}
              >
                {children.title}
              </Box>
            </Grid>
          </Grid>
          <Grid item>
            <Box sx={{ typography: 'body1' }}>{children.text}</Box>
          </Grid>
          {children.button ? (
            <Grid item>
              <a
                href={children.button.link}
                target={children.button.target}
                rel="noreferrer"
              >
                <Button
                  variant="contained"
                  startIcon={children.button.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button.linkText}
                </Button>
              </a>
            </Grid>
          ) : (
            <></>
          )}
          {children.button2 ? (
            <Grid item>
              <a
                href={children.button2.link}
                target={children.button2.target}
                rel="noreferrer"
              >
                <Button
                  variant="contained"
                  startIcon={children.button2.icon}
                  sx={{ marginTop: '1.5em' }}
                  fullWidth
                >
                  {children.button2.linkText}
                </Button>
              </a>
            </Grid>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
}
