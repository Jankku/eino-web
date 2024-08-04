import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

export const getBookCoversQuery = async (query: string) => {
  const res = await api
    .get('api/v1/list/books/images', { searchParams: { query } })
    .json<ApiResponse<string[]>>();
  return res.results;
};

export const useBookCovers = (showCovers: boolean, query: string) =>
  useQuery({
    enabled: showCovers && query.length > 0,
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    queryKey: ['bookCovers', query],
    queryFn: () => getBookCoversQuery(query),
  });
