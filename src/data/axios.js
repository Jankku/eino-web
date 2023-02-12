import axios from 'axios';
import fetchNewToken from './fetchNewToken';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  async (req) => {
    if (req.url.includes('books') || req.url.includes('movies') || req.url.includes('profile')) {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return req;

      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return req;
  },
  async (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  async (res) => res,
  async (err) => fetchNewToken(instance, err)
);

export default instance;
