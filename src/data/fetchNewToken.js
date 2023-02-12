import jwtDecode from 'jwt-decode';

export default async function fetchNewToken(axios, err) {
  const originalRequest = err.config;

  if (err.response?.status === 401 && isAuthorizationError(err) && !originalRequest._retry) {
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || isExpired(refreshToken)) {
      return Promise.reject(err);
    }

    try {
      const res = await axios.post('/auth/refreshtoken', {
        withCredentials: true,
        refreshToken,
      });
      localStorage.setItem('accessToken', res.data.accessToken);

      return axios(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject(err);
  }
}

const isAuthorizationError = (err) => err.response?.data?.errors[0].name === 'authorization_error';

const isExpired = (token) => jwtDecode(token).exp * 1000 < Date.now();
