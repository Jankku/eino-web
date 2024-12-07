import { useSearchParams } from 'react-router';

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [params] = useSearchParams();
  const currentPage = Number.parseInt(params.get('page') || '') || 1;

  const startOffset = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentItems = items.slice(startOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage) || 1;

  return [currentItems, currentPage, pageCount] as const;
}
