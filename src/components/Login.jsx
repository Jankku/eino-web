import { Box, Button, Container, Grid, TextField } from '@material-ui/core';
import React from 'react';
import useState from 'react-usestateref';
import axios from '../axios';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import useToken from '../utils/useToken';
import Error from '../models/error';
import Header from '../components/Header';
import { Fragment } from 'react-is';

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
  },
  textField: {
    margin: '1em 0em',
  },
  error: {
    fontWeight: 700,
    color: 'red',
    margin: '1em 0em 1em 0em',
  },
});

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const { setToken } = useToken();

  // Error states
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [responseError, setResponseError] = useState(Error);

  const [credentials, setCredentials, credRef] = useState({
    username: '',
    password: '',
  });

  const validateForm = () => {
    const { username, password } = credRef.current;

    let isValid = false;

    if (username.length >= 3) {
      setUsernameError(false);
      isValid = true;
    } else {
      setUsernameError(true);
      isValid = false;
    }

    if (password.length >= 8 && password.length <= 255) {
      setpasswordError(false);
      isValid = true;
    } else {
      setpasswordError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = credRef.current;
    if (!validateForm(username, password)) return;

    await axios({
      method: 'post',
      url: '/api/auth/login',
      data: credentials,
    })
      .then((res) => {
        setToken(res.data.token);
        history.push('/books');
      })
      .catch((err) => {
        if (err.response) setResponseError(err.response.data.errors);
      });
  };

  return (
    <>
      <Header />
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
                  error={usernameError}
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
                error={passwordError}
              />
              <Box className={classes.error}>
                <span>{responseError[0].message}</span>
              </Box>
              <Grid>
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
