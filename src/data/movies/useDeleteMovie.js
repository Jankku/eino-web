import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const deleteMovieQuery = async (movieId) => {
  return await api.delete(`api/v1/list/movies/delete/${movieId}`).json();
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId) => deleteMovieQuery(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movies'] }),
  });
};
