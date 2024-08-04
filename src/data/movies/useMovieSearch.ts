import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

const searchMoviesQuery = async (query: string) => {
  const res = await api
    .get(`api/v1/list/movies/search`, { searchParams: { query } })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results;
};

export const useMovieSearch = () => {
  return useMutation({
    mutationFn: (query: string) => searchMoviesQuery(query),
  });
};
