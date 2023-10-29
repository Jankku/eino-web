import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const getMoviePostersQuery = async (query) => {
  const res = await api.get('api/v1/list/movies/images', { searchParams: { query } }).json();
  return res.results;
};

export const useMoviePosters = (showPosters, query) =>
  useQuery({
    enabled: showPosters && query.length > 0,
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    queryKey: ['moviePosters', query],
    queryFn: () => getMoviePostersQuery(query),
  });
