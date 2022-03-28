import {
  Button,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import useState from 'react-usestateref';
import { Link, useNavigate } from 'react-router-dom';
import AuthController from '../../data/AuthController';
import Error from '../../models/error';

export default function Register() {
  const navigate = useNavigate();

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

    if (!validateForm()) return setResponseError('Form validation failed');

    try {
      await AuthController.register(credentials);
      navigate('/login');
    } catch (err) {
      if (err.response) setResponseError(err.response.data.errors);
    }
  };

  return (
    <Container maxWidth="md">
      <form method="post" onSubmit={handleSubmit} encType="application/json">
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8}>
            <Grid item sx={{ textAlign: 'center' }}>
              <h1>Register</h1>
            </Grid>
            <Grid item sx={{ mb: 2 }}>
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
            <Grid item sx={{ mb: 2 }}>
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
            <Grid item sx={{ mb: 2 }}>
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
            <Grid
              sx={{
                fontWeight: 700,
                color: 'red',
                margin: '0 0 1em 0',
              }}
            >
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
              <Typography align="left" paragraph>
                Already have an account?{' '}
                <Link to="/register">
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'underline',
                    }}
                  >
                    Login
                  </Typography>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
