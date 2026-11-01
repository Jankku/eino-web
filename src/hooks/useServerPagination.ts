import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Pagination } from '../data/types';
import { getPageParams } from '../utils/paginationUtil';

export function useServerPagination(defaultPageSize: number, scope = '') {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = getPageParams(searchParams, defaultPageSize);
  const scopeKey = JSON.stringify([scope, params.pageSize]);
  const rawPage = searchParams.get('page');
  const [selection, setSelection] = useState({ scopeKey, resetPage: null as string | null });
  const scopeChanged = selection.scopeKey !== scopeKey;
  const resetPage = scopeChanged ? rawPage : selection.resetPage;
  const shouldReset = resetPage !== null && rawPage === resetPage;

  if (scopeChanged) {
    setSelection({ scopeKey, resetPage: rawPage });
  } else if (selection.resetPage !== null && rawPage !== selection.resetPage) {
    setSelection({ scopeKey, resetPage: null });
  }

  useEffect(() => {
    if (shouldReset) {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.delete('page');
          return next;
        },
        { replace: true },
      );
    }
  }, [shouldReset, setSearchParams]);

  return { ...params, page: scopeChanged || shouldReset ? 1 : params.page };
}

export function useRecoverPage(pagination: Pagination) {
  const [, setSearchParams] = useSearchParams();
  const { page, totalPages } = pagination;

  useEffect(() => {
    const lastPage = Math.max(1, totalPages);
    if (page > lastPage) {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.set('page', String(lastPage));
          return next;
        },
        { replace: true },
      );
    }
  }, [page, totalPages, setSearchParams]);
}
