import { Box } from '@mui/system';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function InfoBox({ children }) {
  return (
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
            <Typography variant="h6">{children.title}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="body1">{children.text}</Typography>
        </Grid>

        {children.button ? (
          <Grid item>
            {children.button.path ? (
              <Link to={children.button.path}>
                <Button
                  variant="contained"
                  startIcon={children.button.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button.linkText}
                </Button>
              </Link>
            ) : (
              <a href={children.button.link} target="_blank" rel="noreferrer">
                <Button
                  variant="contained"
                  startIcon={children.button.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button.linkText}
                </Button>
              </a>
            )}
          </Grid>
        ) : (
          <></>
        )}

        {children.button2 ? (
          <Grid item>
            {children.button2.path ? (
              <Link to={children.button2.path}>
                <Button
                  variant="contained"
                  startIcon={children.button2.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button2.linkText}
                </Button>
              </Link>
            ) : (
              <a href={children.button2.link} target="_blank" rel="noreferrer">
                <Button
                  variant="contained"
                  startIcon={children.button2.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button2.linkText}
                </Button>
              </a>
            )}
          </Grid>
        ) : (
          <></>
        )}

        {children.button3 ? (
          <Grid item>
            {children.button3.path ? (
              <Link to={children.button3.path}>
                <Button
                  variant="contained"
                  startIcon={children.button3.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button3.linkText}
                </Button>
              </Link>
            ) : (
              <a href={children.button3.link} target="_blank" rel="noreferrer">
                <Button
                  variant="contained"
                  startIcon={children.button3.icon}
                  sx={{ marginTop: '1em' }}
                  fullWidth
                >
                  {children.button3.linkText}
                </Button>
              </a>
            )}
          </Grid>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
