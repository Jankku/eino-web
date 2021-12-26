import { Box, Button, Container, Grid, TextField } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import useState from 'react-usestateref';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../utils/useToken';
import Error from '../../models/error';
import AuthController from '../../data/AuthController';

const PREFIX = 'Login';
const classes = {
  title: `${PREFIX}-title`,
  textField: `${PREFIX}-textField`,
  error: `${PREFIX}-error`,
  link: `${PREFIX}-link`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.title}`]: {
    textAlign: 'center',
  },

  [`& .${classes.textField}`]: {
    marginBottom: '1.3em',
  },

  [`& .${classes.error}`]: {
    fontWeight: 700,
    color: 'red',
    margin: '1em 0em 1em 0em',
  },

  [`& .${classes.link}`]: {
    color: theme.palette.text.secondary,
    textDecoration: 'underline',
  },
}));

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();

  const [responseError, setResponseError] = useState(Error);

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await AuthController.login(credentials);

      setToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);

      navigate('/books');
    } catch (err) {
      if (err.response) setResponseError(err.response.data.errors);
    }
  };

  return (
    <Root>
      <Container maxWidth="md">
        <form method="post" onSubmit={handleSubmit} encType="application/json">
          <h1 className={classes.title}>Login</h1>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.root}
          >
            <Grid item xs={12} sm={10} md={8}>
              <Box className={classes.textField}>
                <TextField
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  variant="outlined"
                  label="Username"
                  color="primary"
                  value={credentials.username}
                  onChange={handleChange}
                  fullWidth={true}
                  required={true}
                  inputProps={{ minLength: 3, maxLength: 255 }}
                  autoFocus={true}
                />
              </Box>
              <TextField
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                label="Password"
                color="primary"
                value={credentials.password}
                onChange={handleChange}
                fullWidth={true}
                required={true}
              />
              <Box className={classes.error}>
                <span>{responseError[0].message}</span>
              </Box>
              <Grid
                container
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
                <p>
                  Don't have an account yet?{' '}
                  <Link to="/register" className={classes.link}>
                    Register
                  </Link>
                </p>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Root>
  );
}
