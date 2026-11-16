import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

const searchMoviesQuery = async (query: string, signal: AbortSignal) => {
  const res = await api
    .get(`api/v2/list/movies/search`, { searchParams: { query }, signal })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results;
};

export const useMovieSearch = (query: string) => {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: ({ signal }) => searchMoviesQuery(query, signal),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });
};
