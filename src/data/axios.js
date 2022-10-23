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
      req.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    }
    return req;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    return fetchNewToken(instance, err);
  }
);

export default instance;
