import * as axios from 'axios';
import env from 'react-dotenv';

const instance = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default instance;
