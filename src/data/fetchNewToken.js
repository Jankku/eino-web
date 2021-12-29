import jwt_decode from 'jwt-decode';

export default async function fetchNewToken(axios, err) {
  const originalRequest = err.config;

  if (
    err.response.status === 401 &&
    err.response.data.errors[0].name === 'authorization_error' &&
    !originalRequest._retry
  ) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    originalRequest._retry = true;

    let refreshTokenExp;

    try {
      refreshTokenExp = jwt_decode(refreshToken).exp * 1000;
    } catch (err) {
      return console.error(err);
    }

    if (refreshTokenExp > Date.now()) {
      const res = await axios.post('/api/auth/refreshtoken', {
        withCredentials: true,
        refreshToken,
      });

      localStorage.setItem('accessToken', res.data.accessToken);

      return await axios(originalRequest);
    }
  } else {
    return Promise.reject(err);
  }
}
