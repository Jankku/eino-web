import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

export const getMoviePostersQuery = async (query: string) => {
  const res = await api
    .get('api/v1/list/movies/images', { searchParams: { query } })
    .json<ApiResponse<string[]>>();
  return res.results;
};

export const useMoviePosters = (showPosters: boolean, query: string) =>
  useQuery({
    enabled: showPosters && query.length > 0,
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    queryKey: ['moviePosters', query],
    queryFn: () => getMoviePostersQuery(query),
  });
