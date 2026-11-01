import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useSearchParams } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useRecoverPage, useServerPagination } from '../useServerPagination';
import { Pagination } from '../../data/types';

function Router({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/books?page=3&pageSize=25&sort=title&filter=score%3A%3E%3A5']}>
      {children}
    </MemoryRouter>
  );
}

describe('useServerPagination', () => {
  it('preserves page navigation and resets when status, sort, filter or size changes', async () => {
    const requestedPages = vi.fn();
    const { result, rerender } = renderHook(
      ({ scope }) => {
        const params = useServerPagination(21, scope);
        requestedPages(scope, params.page);
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        return { params, navigate, searchParams };
      },
      { wrapper: Router, initialProps: { scope: 'all/title/score:>:5' } },
    );

    expect(result.current.params).toEqual({ page: 3, pageSize: 25 });
    for (const scope of [
      'completed/title/score:>:5',
      'completed/score/score:>:5',
      'completed/score/score:>:8',
    ]) {
      rerender({ scope });
      await waitFor(() => expect(result.current.params.page).toBe(1));
      expect(requestedPages).not.toHaveBeenCalledWith(scope, 2);
      expect(requestedPages).not.toHaveBeenCalledWith(scope, 3);
      expect(result.current.searchParams.get('filter')).toBe('score:>:5');
      act(() => result.current.navigate('?page=2&pageSize=25&filter=score%3A%3E%3A5'));
      expect(result.current.params.page).toBe(2);
    }
    act(() => result.current.navigate('?page=2&pageSize=50'));
    await waitFor(() => expect(result.current.params).toEqual({ page: 1, pageSize: 50 }));
  });
});

describe('useRecoverPage', () => {
  it('recovers an emptied last page and handles zero total pages', async () => {
    const { result, rerender } = renderHook(
      ({ pagination }: { pagination: Pagination }) => {
        useRecoverPage(pagination);
        return useSearchParams()[0];
      },
      {
        wrapper: Router,
        initialProps: { pagination: { page: 3, pageSize: 25, total: 51, totalPages: 3 } },
      },
    );

    expect(result.current.get('page')).toBe('3');
    rerender({ pagination: { page: 3, pageSize: 25, total: 50, totalPages: 2 } });
    await waitFor(() => expect(result.current.get('page')).toBe('2'));
    expect(result.current.get('filter')).toBe('score:>:5');
    rerender({ pagination: { page: 2, pageSize: 25, total: 0, totalPages: 0 } });
    await waitFor(() => expect(result.current.get('page')).toBe('1'));
  });
});
