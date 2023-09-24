import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const getBookCoversQuery = async (query) => {
  const res = await api.get('api/v1/list/books/images', { searchParams: { query } }).json();
  return res.results;
};

export const useBookCovers = (showCovers, query) =>
  useQuery({
    enabled: showCovers && query.length > 0,
    useErrorBoundary: false,
    suspense: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    queryKey: ['bookCovers', query],
    queryFn: () => getBookCoversQuery(query),
  });
