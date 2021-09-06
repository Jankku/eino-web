import {
  Button,
  Container,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import React from 'react';
import useState from 'react-usestateref';
import { Link, useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import AuthController from '../../data/AuthController';
import Error from '../../models/error';

const PREFIX = 'Register';

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

export default function Register() {
  const history = useHistory();

  // Error states
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [passwordMatchError, setpasswordMatchError] = useState(false);
  const [responseError, setResponseError] = useState(Error);

  const [credentials, setCredentials, credRef] = useState({
    username: '',
    password: '',
    password2: '',
  });

  const validateForm = () => {
    let isValid = true;

    const { username, password, password2 } = credRef.current;

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

    if (password === password2) {
      setpasswordMatchError(false);
      isValid = true;
    } else {
      setpasswordMatchError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return console.error('Form validation failed');

    try {
      await AuthController.register(credentials);
      history.push('/login');
    } catch (err) {
      if (err.response) setResponseError(err.response.data.errors);
    }
  };

  return (
    <Root>
      <Header />
      <Container maxWidth="md">
        <form method="post" onSubmit={handleSubmit} encType="application/json">
          <h1 className={classes.title}>Register</h1>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.root}
          >
            <Grid item xs={12} sm={10} md={8}>
              <Grid item className={classes.textField}>
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
                  autoFocus={true}
                />
                <FormHelperText>
                  Username should be 3-255 characters long
                </FormHelperText>
              </Grid>
              <Grid className={classes.textField}>
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
                <FormHelperText>
                  Password should be 8-255 characters long
                </FormHelperText>
              </Grid>
              <Grid className={classes.textField}>
                <TextField
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  variant="outlined"
                  label="Confirm password"
                  color="primary"
                  value={credentials.password2}
                  onChange={handleChange}
                  fullWidth={true}
                  required={true}
                  error={passwordMatchError}
                />
              </Grid>
              <Grid className={classes.error}>
                <span>{responseError[0].message}</span>
              </Grid>
              <Grid
                container
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Button type="submit" variant="contained">
                  Register
                </Button>
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className={classes.link}>
                    Login
                  </Link>
                  {''}
                </p>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Root>
  );
}
