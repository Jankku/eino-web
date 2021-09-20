import * as axios from 'axios';
import fetchNewToken from './fetchNewToken';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  responseType: 'json',
});

instance.interceptors.request.use(
  async (req) => {
    if (req.url.includes('/register')) return req;
    if (req.url.includes('/login')) return req;

    // Add Authorization header to book and movie routes
    if (req.url.includes('books') || req.url.includes('movies')) {
      req.headers['Authorization'] = `Bearer ${localStorage.getItem(
        'accessToken'
      )}`;
    }

    return req;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    fetchNewToken(instance, err);
    return Promise.reject(err);
  }
);

export default instance;
