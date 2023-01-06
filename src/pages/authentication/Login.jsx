import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import useState from 'react-usestateref';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import Error from '../../models/error';
import { loginUser } from '../../data/Auth';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import { useMutation } from 'react-query';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  const [responseError, setResponseError] = useState(Error);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const loginMutation = useMutation((userCredentials) => loginUser(userCredentials), {
    onSuccess: (data) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsLoggedIn(true);
      navigate('/books');
    },
    onError: (err) => setResponseError(err.response.data.errors),
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <Container maxWidth="md">
      <form method="post" onSubmit={handleSubmit} encType="application/json">
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8}>
            <Grid item sx={{ textAlign: 'center' }}>
              <h1>Login</h1>
            </Grid>
            <TextField
              required
              fullWidth
              autoFocus
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              variant="outlined"
              label="Username"
              color="primary"
              value={credentials.username}
              onChange={handleChange}
              inputProps={{ minLength: 3, maxLength: 255 }}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              label="Password"
              color="primary"
              value={credentials.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Typography
              paragraph
              id="errorText"
              sx={{
                fontWeight: 700,
                color: 'red',
                margin: '0 0 1em 0',
              }}
            >
              {responseError[0].message}
            </Typography>
            <Grid container alignItems="flex-start" justifyContent="space-between">
              <Button
                disabled={loginMutation.isLoading}
                type="submit"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
              <Typography align="left" paragraph>
                Don&apos;t have an account yet?{' '}
                <Link to="/register">
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'underline',
                    }}
                  >
                    Register
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
