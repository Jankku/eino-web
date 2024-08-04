import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteMovieQuery = async (movieId: string) => {
  return await api.delete(`api/v1/list/movies/delete/${movieId}`).json<ApiResponse<Result>>();
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId: string) => deleteMovieQuery(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movies'] }),
  });
};
