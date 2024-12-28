import ky from 'ky';
import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import { errorSchema } from '../utils/zodUtil.ts';

const API_URL = new URL('/api', import.meta.env.VITE_BASE_URL).toString();

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (request.url.startsWith(API_URL)) {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) return request;
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (input, options, response) => {
        if ([401, 403].includes(response.status)) {
          const error = await response.json();
          const parsedError = errorSchema.parse(error);
          const errorName = parsedError.errors[0].name;
          switch (errorName) {
            case 'authorization_error':
              localStorage.setItem('accessToken', await fetchNewToken(response));
              return ky(input, options);
            case 'account_disabled':
              window.location.href = '/logout';
              break;
            default:
              return Promise.reject(error);
          }
        }
      },
    ],
  },
});

const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

async function fetchNewToken(originalResponse: Response) {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || isExpired(refreshToken)) {
      return Promise.reject(originalResponse);
    }
    const response = await api.post('api/v1/auth/refreshtoken', { json: { refreshToken } }).json();
    const validated = refreshTokenResponseSchema.parse(response);
    return validated.accessToken;
  } catch (error) {
    return Promise.reject(error);
  }
}

const isExpired = (token: string) => jwtDecode(token).exp! * 1000 < Date.now();
