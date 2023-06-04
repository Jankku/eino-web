import { useSearchParams } from 'react-router-dom';

export default function usePagination(items, itemsPerPage) {
  const [params] = useSearchParams();
  const currentPage = parseInt(params.get('page')) || 1;

  const startOffset = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentItems = items.slice(startOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage) || 1;

  return [currentItems, currentPage, pageCount];
}
