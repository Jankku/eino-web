import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Movie } from '../../models/movie';
import { ApiResponse, Result } from '../types';

const addMovieQuery = async (movie: Movie) => {
  return await api.post('api/v1/list/movies/add', { json: movie }).json<ApiResponse<Result>>();
};

export const useAddMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movie: Movie) => addMovieQuery(movie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};
