import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../api';
import { getBooksQuery, useBooksSuspense } from '../books/useBooksSuspense';
import { getMoviesQuery, useMoviesSuspense } from '../movies/useMoviesSuspense';

vi.mock('../api', () => ({ api: { get: vi.fn() } }));

afterEach(() => vi.clearAllMocks());

describe.each([
  { kind: 'books', useList: useBooksSuspense, getFullList: getBooksQuery },
  { kind: 'movies', useList: useMoviesSuspense, getFullList: getMoviesQuery },
])('$kind pagination cache', ({ kind, useList, getFullList }) => {
  it('keeps page results, complete lists and independent status counts separate', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const fullKey = [kind, 'full', 'all', 'title', 'ascending', ''];
    const completeList = [{ title: 'Full list item' }, { title: 'Another full list item' }];
    queryClient.setQueryData(fullKey, completeList);
    const pageResponse = {
      results: [{ title: 'Page two item' }],
      pagination: { page: 2, pageSize: 25, total: 22, totalPages: 2 },
    };
    vi.mocked(api.get).mockImplementation(
      (path, options) =>
        ({
          json: () =>
            Promise.resolve(
              String(path).endsWith('/count')
                ? { all: 46, completed: 25 }
                : options?.searchParams &&
                    typeof options.searchParams === 'object' &&
                    'page' in options.searchParams
                  ? pageResponse
                  : { results: completeList },
            ),
        }) as ReturnType<typeof api.get>,
    );
    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>{children}</Suspense>
        </QueryClientProvider>
      );
    }
    const { result, unmount } = renderHook(
      () =>
        useList({
          status: 'all',
          page: 2,
          pageSize: 25,
          sort: 'score',
          order: 'descending',
          filter: 'score:>:5',
        }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current?.data).toEqual(pageResponse.results));
    expect(result.current.pagination).toEqual(pageResponse.pagination);
    expect(result.current.countByStatus.all).toBe(46);
    expect(queryClient.getQueryData(fullKey)).toEqual(completeList);
    expect(api.get).toHaveBeenCalledWith(`api/v2/list/${kind}/all`, {
      searchParams: {
        page: 2,
        pageSize: 25,
        sort: 'score',
        order: 'descending',
        filter: 'score:>:5',
      },
    });
    await expect(getFullList({ status: 'all' })).resolves.toEqual(completeList);
    expect(api.get).toHaveBeenLastCalledWith(`api/v2/list/${kind}/all`, {
      searchParams: { sort: 'title', order: 'ascending', filter: '' },
    });
    unmount();
    queryClient.clear();
  });
});
