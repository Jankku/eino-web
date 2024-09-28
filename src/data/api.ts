import ky from 'ky';
import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import { errorSchema } from '../utils/zodUtil.ts';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (
          request.url.includes('books') ||
          request.url.includes('movies') ||
          request.url.includes('profile') ||
          request.url.includes('email') ||
          request.url.includes('2fa') ||
          request.url.includes('admin')
        ) {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) return request;
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (input, options, response) => {
        if (response.status === 401) {
          const error = await response.json();
          const parsedError = errorSchema.parse(error);
          if (!(parsedError.errors[0].name === 'authorization_error')) return Promise.reject(error);
          const accessToken = await fetchNewToken(response);
          localStorage.setItem('accessToken', accessToken);
          return ky(input, options);
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
