import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

export const getMoviePostersQuery = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/v1/list/movies/images`,
    params: { query },
  });
  return res.data.results;
};

export const useMoviePosters = (showPosters, query) =>
  useQuery({
    enabled: showPosters && query.length > 0,
    useErrorBoundary: false,
    suspense: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    queryKey: ['moviePosters', query],
    queryFn: () => getMoviePostersQuery(query),
  });
