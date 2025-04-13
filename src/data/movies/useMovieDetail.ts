import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

export const getMovieDetailQuery = async (movieId: string) => {
  const res = await api
    .get(`api/v1/list/movies/movie/${movieId}`)
    .json<ApiResponse<MovieWithId[]>>();
  return res.results[0];
};

export const useMovieDetail = (movieId: string) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetailQuery(movieId),
    initialData: () =>
      queryClient
        .getQueryData<MovieWithId[]>(['movies', 'all'])
        ?.find((m) => m.movie_id === movieId),
  });
};
