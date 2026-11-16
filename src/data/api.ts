import ky, { isHTTPError } from 'ky';
import { z } from 'zod';
import { errorSchema } from '../utils/zodUtil.ts';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from '../utils/tokenStorage.ts';

const API_URL = new URL('/api', import.meta.env.VITE_BASE_URL).toString();

const getBearerToken = (request: Request) =>
  request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? null;

export const api = ky.create({
  prefix: import.meta.env.VITE_BASE_URL,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (request.url.startsWith(API_URL)) {
          const accessToken = getAccessToken();
          if (accessToken) request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (![401, 403].includes(response.status)) return;

        // Only handle token errors here. Anything else falls through so ky throws an HTTPError.
        // Requests without a token (e.g. login) report their own errors.
        const usedToken = getBearerToken(request);
        if (!usedToken) return;

        const errorName = await getErrorName(response);

        if (errorName === 'account_disabled') {
          logout();
          return;
        }

        if (errorName !== 'authorization_error') return;

        // Another request may have refreshed the token while this one was in flight.
        const currentToken = getAccessToken();
        const newToken =
          currentToken && currentToken !== usedToken ? currentToken : await refreshAccessToken();
        if (!newToken) return;

        const headers = new Headers(request.headers);
        headers.set('Authorization', `Bearer ${newToken}`);
        return ky.retry({
          request: new Request(request, { headers }),
          code: 'TOKEN_REFRESHED',
          delay: 0,
        });
      },
    ],
  },
});

async function getErrorName(response: Response) {
  try {
    const parsed = errorSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.errors[0]?.name : undefined;
  } catch {
    return undefined;
  }
}

const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

// Without hooks, so a failed refresh can't recurse into the interceptor.
const authApi = ky.create({ prefix: import.meta.env.VITE_BASE_URL });

let refreshPromise: Promise<string | null> | null = null;

/**
 * Refreshes the access token once for all concurrent callers.
 * Resolves to null if the refresh failed, logging the user out if the session is no longer valid.
 */
function refreshAccessToken() {
  refreshPromise ??= fetchNewToken().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function fetchNewToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    return null;
  }
  try {
    const response = await authApi
      .post('api/v2/auth/refreshtoken', { json: { refreshToken } })
      .json();
    const { accessToken } = refreshTokenResponseSchema.parse(response);
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    // A rejected refresh token (revoked, expired or disabled account) means the session is over.
    // Network errors and server errors are transient, so keep the session.
    if (isHTTPError(error) && error.response.status < 500) logout();
    return null;
  }
}

function logout() {
  clearTokens();
  if (window.location.pathname !== '/logout') window.location.assign('/logout');
}
