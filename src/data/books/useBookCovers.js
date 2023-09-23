import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

export const getBookCoversQuery = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/v1/list/books/images`,
    params: { query },
  });
  return res.data.results;
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
