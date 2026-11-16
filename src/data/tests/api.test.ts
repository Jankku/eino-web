import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTPError } from 'ky';
import { api } from '../api';
import { parseError } from '../../utils/zodUtil';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const apiError = (status: number, name: string, message = name) =>
  jsonResponse(status, { errors: [{ name, message }] });

const isRefresh = (request: Request) => request.url.endsWith('/api/v2/auth/refreshtoken');

describe('api auth interceptor', () => {
  let fetchMock: ReturnType<typeof vi.fn<(request: Request) => Promise<Response>>>;

  beforeEach(() => {
    localStorage.setItem('accessToken', 'old-token');
    localStorage.setItem('refreshToken', 'refresh-token');
    fetchMock = vi.fn<(request: Request) => Promise<Response>>();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('refreshes once for concurrent requests and retries them with the new token', async () => {
    const storageListener = vi.fn();
    window.addEventListener('storage', storageListener);

    fetchMock.mockImplementation(async (request) => {
      if (isRefresh(request)) return jsonResponse(200, { accessToken: 'new-token' });
      if (request.headers.get('Authorization') === 'Bearer new-token') {
        return jsonResponse(200, { ok: true });
      }
      return apiError(401, 'authorization_error');
    });

    const results = await Promise.all([
      api.get('api/v2/books/count').json(),
      api.get('api/v2/books').json(),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }]);
    expect(fetchMock.mock.calls.filter(([request]) => isRefresh(request))).toHaveLength(1);
    expect(localStorage.getItem('accessToken')).toBe('new-token');
    expect(storageListener).toHaveBeenCalled();

    window.removeEventListener('storage', storageListener);
  });

  it('throws an HTTPError with parsed data for non-token 403 errors', async () => {
    fetchMock.mockResolvedValue(apiError(403, 'forbidden', 'Forbidden'));

    const error = await api.get('api/v2/admin/users').json().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(HTTPError);
    expect(parseError(error)).toEqual([{ name: 'forbidden', message: 'Forbidden' }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('logs out when the refresh token is rejected', async () => {
    fetchMock.mockImplementation(async (request) =>
      isRefresh(request)
        ? apiError(401, 'jwt_refresh_error')
        : apiError(401, 'authorization_error'),
    );

    await expect(api.get('api/v2/books').json()).rejects.toBeInstanceOf(HTTPError);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('keeps the session when the refresh fails with a server error', async () => {
    fetchMock.mockImplementation(async (request) =>
      isRefresh(request) ? jsonResponse(500, {}) : apiError(401, 'authorization_error'),
    );

    await expect(api.get('api/v2/books').json()).rejects.toBeInstanceOf(HTTPError);
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });
});

describe('parseError', () => {
  it('returns a fallback error for non-HTTP errors', async () => {
    const errors = parseError(new TypeError('Failed to fetch'));
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/could not reach the server/i);
  });
});
