import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../api';
import { getPage } from '../pagination';

vi.mock('../api', () => ({ api: { get: vi.fn() } }));

describe('getPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends server sort/filter and pagination together and retains actual out-of-range totals', async () => {
    const response = {
      results: [],
      pagination: { page: 9, pageSize: 25, total: 51, totalPages: 3 },
    };
    vi.mocked(api.get).mockReturnValue({ json: () => Promise.resolve(response) } as ReturnType<
      typeof api.get
    >);
    await expect(
      getPage(
        'api/v2/list/books/all',
        { page: 9, pageSize: 25 },
        { sort: 'score', order: 'descending', filter: 'score:>:5' },
      ),
    ).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith('api/v2/list/books/all', {
      searchParams: {
        page: 9,
        pageSize: 25,
        sort: 'score',
        order: 'descending',
        filter: 'score:>:5',
      },
    });
  });

  it('reports an undeployed backend rather than treating a full list as one page', async () => {
    vi.mocked(api.get).mockReturnValue({
      json: () => Promise.resolve({ results: [] }),
    } as ReturnType<typeof api.get>);
    await expect(getPage('api/v2/admin/users', { page: 1, pageSize: 25 })).rejects.toThrow(
      'backend pagination update must be deployed',
    );
  });

  it('omits an empty filter, which is invalid for the paginated API', async () => {
    const response = {
      results: [],
      pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 },
    };
    vi.mocked(api.get).mockReturnValue({ json: () => Promise.resolve(response) } as ReturnType<
      typeof api.get
    >);
    await getPage('api/v2/list/movies/all', { page: 1, pageSize: 25 }, { filter: '' });
    expect(api.get).toHaveBeenCalledWith('api/v2/list/movies/all', {
      searchParams: { page: 1, pageSize: 25 },
    });
  });

  it('propagates API errors to the existing error boundary', async () => {
    vi.mocked(api.get).mockReturnValue({
      json: () => Promise.reject<unknown>(new Error('422')),
    } as ReturnType<typeof api.get>);
    await expect(getPage('api/v2/admin/audits', { page: 1, pageSize: 25 })).rejects.toThrow('422');
  });
});
