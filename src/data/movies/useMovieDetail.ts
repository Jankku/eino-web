import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

export const getMovieDetailQuery = async (movieId: string) => {
  const res = await api
    .get(`api/v2/list/movies/movie/${movieId}`)
    .json<ApiResponse<MovieWithId[]>>();
  return res.results[0];
};

export const useMovieDetail = (movieId: string) => {
  return useSuspenseQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetailQuery(movieId),
  });
};
