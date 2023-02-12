import { Button, Container, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import useState from 'react-usestateref';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { useAuthContext } from '../../providers/AuthenticationProvider';
import ErrorMessage from '../../components/authentication/ErrorMessage';
import { useLoginUser } from '../../data/auth/useLoginUser';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useToken();
  const { setIsLoggedIn } = useAuthContext();
  const [responseError, setResponseError] = useState();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const loginUser = useLoginUser();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser.mutate(credentials, {
      onSuccess: (data) => {
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setIsLoggedIn(true);
        navigate('/books');
      },
      onError: (err) => setResponseError(err.response.data.errors),
    });
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
              inputProps={{ minLength: 8, maxLength: 255 }}
              sx={{ mb: 2 }}
            />
            {loginUser.isLoading && <LinearProgress sx={{ marginBottom: 2 }} />}
            {responseError !== undefined && <ErrorMessage message={responseError[0]?.message} />}
            <Grid container alignItems="flex-start" justifyContent="space-between">
              <Button
                disabled={loginUser.isLoading}
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
